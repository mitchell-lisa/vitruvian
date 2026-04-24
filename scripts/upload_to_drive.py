#!/usr/bin/env python3
"""
upload_to_drive.py

Uploads Modulor's local repo content into the "Modulor" Shared Drive
using the folder structure we agreed on.

Run:
    python scripts/upload_to_drive.py --dry-run   # preview, no uploads
    python scripts/upload_to_drive.py             # actual upload

Auth:
    Uses the same OAuth client as ingest_receipts.py
    (private/google-credentials.json). Drive scope requires a separate
    consent — first run opens a browser. Token cached at
    private/drive-token.json.

Idempotent: skips files that already exist by name in the target folder.
Safe to re-run after adding new files.
"""

import argparse
import pathlib
import sys

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

REPO_ROOT = pathlib.Path(__file__).parent.parent

CREDS_PATH = REPO_ROOT / "private" / "google-credentials.json"
TOKEN_PATH = REPO_ROOT / "private" / "drive-token.json"

SCOPES = ["https://www.googleapis.com/auth/drive"]

DRIVE_NAME = "Modulor"

# (local_path_relative_to_repo_root, destination_folder_name)
UPLOADS = [
    # 00_Corporate
    ("private/company-formation.md",           "00_Corporate"),
    ("private/atlas-ip-share-consideration.md", "00_Corporate"),

    # 01_Finances
    ("private/finances.md",                    "01_Finances"),
    ("private/ledger.csv",                     "01_Finances"),

    # 02_IP_Patent
    ("VITR-001-PROV-Specification.pdf",        "02_IP_Patent"),
    ("VITR-001-PROV-Drawings.pdf",             "02_IP_Patent"),

    # 03_Product
    ("docs/01-product-definition.md",          "03_Product"),
    ("docs/02-mvp-design.md",                  "03_Product"),
    ("docs/03-mechanical-system.md",           "03_Product"),
    ("docs/04-sensor-ai-system.md",            "03_Product"),
    ("docs/05-user-experience-flow.md",        "03_Product"),
    ("docs/06-prototype-build-plan.md",        "03_Product"),
    ("docs/07-what-to-cut.md",                 "03_Product"),
    ("docs/08-what-makes-this-special.md",     "03_Product"),
    ("docs/20-integration-roadmap.md",         "03_Product"),
    ("docs/PRODUCT_REDESIGN.md",               "03_Product"),

    # 04_Fundraise
    ("private/investor-qa-packet.md",          "04_Fundraise"),

    # 05_Team
    ("private/luke-role-memo.md",              "05_Team"),
    ("private/andrew-role-memo.md",            "05_Team"),
    ("private/adam-role-memo.md",              "05_Team"),

    # 06_Outreach
    ("private/outreach.md",                    "06_Outreach"),

    # 07_Legal
    ("private/nda-click-wrap.md",              "07_Legal"),

    # 08_DoD
    ("docs/19-military-gtm.md",                "08_DoD"),
]

# Defensive deny-list. Script only uploads UPLOADS, but this asserts
# nothing sensitive ever gets added by accident.
NEVER_UPLOAD = {
    "private/.founder-private.md",
    "private/google-credentials.json",
    "private/google-token.json",
    "private/drive-token.json",
    ".env",
    ".env.local",
}


def authenticate():
    creds = None
    if TOKEN_PATH.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CREDS_PATH.exists():
                sys.exit(f"Missing OAuth creds: {CREDS_PATH}\n"
                        "Expected the same file used by ingest_receipts.py.")
            flow = InstalledAppFlow.from_client_secrets_file(str(CREDS_PATH), SCOPES)
            creds = flow.run_local_server(port=0)
        TOKEN_PATH.write_text(creds.to_json())
    return build("drive", "v3", credentials=creds)


def find_shared_drive(service, name):
    response = service.drives().list(pageSize=100).execute()
    for drive in response.get("drives", []):
        if drive["name"] == name:
            return drive["id"]
    sys.exit(f"Shared Drive '{name}' not found. Create it first, or check the name.")


def list_folders(service, drive_id):
    """Return {folder_name: folder_id} for top-level folders in the shared drive."""
    query = (
        f"'{drive_id}' in parents "
        "and mimeType = 'application/vnd.google-apps.folder' "
        "and trashed = false"
    )
    response = service.files().list(
        q=query,
        corpora="drive",
        driveId=drive_id,
        includeItemsFromAllDrives=True,
        supportsAllDrives=True,
        fields="files(id, name)",
        pageSize=100,
    ).execute()
    return {f["name"]: f["id"] for f in response.get("files", [])}


def file_exists_in_folder(service, folder_id, filename, drive_id):
    safe_name = filename.replace("'", "\\'")
    query = (
        f"'{folder_id}' in parents "
        f"and name = '{safe_name}' "
        "and trashed = false"
    )
    response = service.files().list(
        q=query,
        corpora="drive",
        driveId=drive_id,
        includeItemsFromAllDrives=True,
        supportsAllDrives=True,
        fields="files(id, name)",
        pageSize=1,
    ).execute()
    return bool(response.get("files"))


def upload_file(service, local_path, folder_id, drive_id):
    metadata = {"name": local_path.name, "parents": [folder_id]}
    media = MediaFileUpload(str(local_path), resumable=False)
    service.files().create(
        body=metadata,
        media_body=media,
        supportsAllDrives=True,
        fields="id",
    ).execute()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true",
                        help="Preview uploads without sending anything.")
    args = parser.parse_args()

    # Safety: no UPLOADS entry may hit the NEVER_UPLOAD set.
    for local, _ in UPLOADS:
        if local in NEVER_UPLOAD:
            sys.exit(f"Refusing to upload blocked file: {local}")

    print(f"{'DRY RUN — ' if args.dry_run else ''}Connecting to Drive...")
    service = authenticate()

    drive_id = find_shared_drive(service, DRIVE_NAME)
    print(f"Shared Drive '{DRIVE_NAME}' → id {drive_id}")

    folders = list_folders(service, drive_id)
    print(f"Found folders: {', '.join(sorted(folders))}\n")

    uploaded, skipped_exists, skipped_missing, missing_folders = 0, 0, 0, set()

    for local_rel, folder_name in UPLOADS:
        local_path = REPO_ROOT / local_rel
        if not local_path.exists():
            print(f"  ⊘ SKIP (not on disk): {local_rel}")
            skipped_missing += 1
            continue
        if folder_name not in folders:
            missing_folders.add(folder_name)
            print(f"  ✗ NO FOLDER: {local_rel} → {folder_name}")
            continue

        folder_id = folders[folder_name]
        if file_exists_in_folder(service, folder_id, local_path.name, drive_id):
            print(f"  = EXISTS: {local_rel} → {folder_name}/")
            skipped_exists += 1
            continue

        if args.dry_run:
            print(f"  + WOULD UPLOAD: {local_rel} → {folder_name}/")
        else:
            try:
                upload_file(service, local_path, folder_id, drive_id)
                print(f"  ✓ UPLOADED: {local_rel} → {folder_name}/")
                uploaded += 1
            except HttpError as e:
                print(f"  ✗ FAILED: {local_rel} — {e}")

    print(f"\nSummary: {uploaded} uploaded · {skipped_exists} already existed · "
          f"{skipped_missing} missing on disk · {len(missing_folders)} missing folders")

    if missing_folders:
        print(f"\n⚠  Create these folders in Drive and re-run:")
        for f in sorted(missing_folders):
            print(f"    {f}")


if __name__ == "__main__":
    main()
