"""Mutual NDA — Modulor, Inc. ↔ Adam H. Evans.

Source-of-truth for the mutual NDA being executed pre-FAST Platinum.
Renders to .md / .docx / .pdf via scripts/render_legal_doc.py.

Render command:
    python scripts/render_legal_doc.py \\
        scripts/legal_sources/adam_evans_mutual_nda.py \\
        --out-dir build/drive-upload/07_Legal

Optional second render (gitignored DocuSign staging):
    python scripts/render_legal_doc.py \\
        scripts/legal_sources/adam_evans_mutual_nda.py \\
        --out-dir private/legal-templates/drafts

Term: 2 years.  Governing law: Delaware.  Mutual disclosure.
"""

TITLE = "Mutual Non-Disclosure Agreement"

OUT_BASENAME = "Adam-Evans-Mutual-NDA"

BLOCKS = [
    ("h1", "Mutual Non-Disclosure Agreement"),

    ("p",
     "This Mutual Non-Disclosure Agreement (this “Agreement”) is entered into as "
     "of the latest date of signature below (the “Effective Date”) by and between "
     "Modulor, Inc., a Delaware corporation with a principal place of business at "
     "1111B S Governors Ave STE 27384, Dover, DE 19904 (“Modulor”), and "
     "Adam H. Evans, an individual (“Advisor”). Modulor and Advisor are each "
     "referred to as a “Party” and together as the “Parties.”"),

    ("p",
     "The Parties anticipate exchanging Confidential Information (defined below) in "
     "connection with Advisor’s evaluation of, and prospective service in, a "
     "strategic advisor role at Modulor (the “Purpose”). The Parties enter into "
     "this Agreement to protect the confidentiality of information disclosed between "
     "them in furtherance of the Purpose."),

    ("h2", "1. Confidential Information"),
    ("p",
     "“Confidential Information” means any non-public information disclosed by one "
     "Party (the “Disclosing Party”) to the other (the “Receiving Party”), "
     "whether disclosed orally, in writing, electronically, visually, or by inspection, "
     "and whether or not marked or identified as confidential, that a reasonable person "
     "would understand to be confidential given the nature of the information and the "
     "circumstances of disclosure. Confidential Information includes, without limitation: "
     "product designs, prototypes, hardware and firmware specifications, sensor and ML "
     "architectures, algorithms, source code, patent claims and unfiled invention "
     "disclosures, research data, clinical and biomechanical study designs, customer and "
     "prospect lists, pricing and unit economics, fundraising plans, financial "
     "projections, cap table information, partner and government-program relationships, "
     "and personnel matters."),

    ("h2", "2. Permitted Use"),
    ("p",
     "The Receiving Party shall use the Confidential Information solely for the Purpose "
     "and for no other purpose. The Receiving Party shall not use the Confidential "
     "Information for its own benefit or the benefit of any third party, and shall not "
     "use it to compete with the Disclosing Party in any manner."),

    ("h2", "3. Non-Disclosure"),
    ("p",
     "The Receiving Party shall hold the Confidential Information in strict confidence "
     "and shall not disclose, publish, or disseminate Confidential Information to any "
     "third party without the prior written consent of the Disclosing Party, except to "
     "the Receiving Party’s employees, contractors, attorneys, accountants, or other "
     "advisors who (a) have a legitimate need to know for the Purpose, and (b) are bound "
     "by written or professional obligations of confidentiality at least as protective "
     "as those in this Agreement. The Receiving Party shall be responsible for any "
     "breach of this Agreement by such persons."),

    ("h2", "4. Standard of Care"),
    ("p",
     "The Receiving Party shall protect the Confidential Information using the same "
     "degree of care it uses to protect its own information of like importance, but in "
     "no event less than a reasonable standard of care. The Receiving Party shall "
     "promptly notify the Disclosing Party of any unauthorized use or disclosure of "
     "Confidential Information of which it becomes aware, and shall cooperate with the "
     "Disclosing Party to mitigate the effects of any such breach."),

    ("h2", "5. Exclusions"),
    ("p",
     "Confidential Information does not include information that the Receiving Party "
     "can demonstrate by contemporaneous written records: (a) was rightfully in the "
     "Receiving Party’s possession without restriction prior to disclosure by the "
     "Disclosing Party; (b) is or becomes generally available to the public through no "
     "act or omission of the Receiving Party; (c) is rightfully received by the "
     "Receiving Party from a third party without a duty of confidentiality; or "
     "(d) is independently developed by the Receiving Party without use of or reference "
     "to the Disclosing Party’s Confidential Information."),

    ("h2", "6. Compelled Disclosure"),
    ("p",
     "If the Receiving Party is required by law, regulation, court order, or other "
     "governmental or judicial process to disclose Confidential Information, the "
     "Receiving Party shall, to the extent legally permitted, give the Disclosing Party "
     "prompt prior written notice so that the Disclosing Party may seek a protective "
     "order or other appropriate remedy. The Receiving Party shall reasonably cooperate "
     "with the Disclosing Party at the Disclosing Party’s expense and shall disclose "
     "only that portion of the Confidential Information that is legally required to be "
     "disclosed."),

    ("h2", "7. Return or Destruction"),
    ("p",
     "Upon the Disclosing Party’s written request, or upon termination of the "
     "Purpose, the Receiving Party shall promptly return or destroy all Confidential "
     "Information in its possession or control, including all copies, extracts, and "
     "derivatives, and certify the same in writing upon request. The Receiving Party "
     "may retain one archival copy solely for compliance and record-keeping purposes, "
     "subject to continuing obligations of confidentiality under this Agreement."),

    ("h2", "8. No License; No Obligation"),
    ("p",
     "Nothing in this Agreement grants either Party any license, ownership, or other "
     "rights in or to the Confidential Information of the other Party, by implication, "
     "estoppel, or otherwise, except the limited right to use such Confidential "
     "Information for the Purpose. Neither Party is obligated by this Agreement to "
     "enter into any further agreement, investment, business relationship, or "
     "transaction with the other Party."),

    ("h2", "9. Term and Survival"),
    ("p",
     "This Agreement shall be effective as of the Effective Date and shall continue "
     "for a period of two (2) years thereafter, unless earlier terminated by mutual "
     "written agreement of the Parties. The confidentiality obligations of the "
     "Receiving Party with respect to Confidential Information disclosed during the "
     "term shall survive for two (2) years following the date of disclosure; obligations "
     "with respect to information that constitutes a trade secret under applicable law "
     "shall survive for so long as such information remains a trade secret."),

    ("h2", "10. Remedies"),
    ("p",
     "The Parties acknowledge that any breach of this Agreement may cause irreparable "
     "harm for which monetary damages would be inadequate. Accordingly, in addition to "
     "any other remedies available at law or in equity, the non-breaching Party shall "
     "be entitled to seek injunctive relief without the requirement of posting a bond."),

    ("h2", "11. Governing Law and Venue"),
    ("p",
     "This Agreement shall be governed by and construed in accordance with the laws of "
     "the State of Delaware, without regard to its conflict-of-laws principles. Any "
     "dispute arising out of or related to this Agreement shall be brought exclusively "
     "in the state or federal courts located in Delaware, and the Parties consent to "
     "the personal jurisdiction of such courts."),

    ("h2", "12. Miscellaneous"),
    ("p",
     "This Agreement constitutes the entire understanding between the Parties with "
     "respect to its subject matter and supersedes all prior or contemporaneous "
     "communications. It may be amended only by a writing signed by both Parties. If "
     "any provision is held unenforceable, the remaining provisions shall remain in "
     "full force and effect. This Agreement may be executed in counterparts, including "
     "by electronic signature, each of which shall be deemed an original and all of "
     "which together shall constitute one instrument. Neither Party may assign this "
     "Agreement without the prior written consent of the other Party, except that "
     "Modulor may assign this Agreement to a successor in connection with a merger, "
     "acquisition, reorganization, or sale of all or substantially all of its assets."),

    ("spacer", ""),
    ("h2", "Signatures"),
    ("spacer", ""),

    ("sig", [
        "MODULOR, INC.",
        "",
        "By: ______________________________________",
        "Name: Mitchell Lisa",
        "Title: Chief Executive Officer",
        "Date: ____________________________________",
    ]),

    ("sig", [
        "ADVISOR",
        "",
        "By: ______________________________________",
        "Name: Adam H. Evans",
        "Date: ____________________________________",
    ]),
]
