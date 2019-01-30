Application State
=================

The ICL is concerned with transactions between customs authorities
(and parties with delegated authority).

The initial implementation, and example
used throughtout the intial design exercises
is a Certificate of Origin (CoO)
(per the China Australia Free Trade Agreement, or ChAFTA).
We anticipate that the transaction patterns
appropriate for the exchange of ChAFTA CoO
will also be applicable
(posibly with some modification)
for the exchange of other artefacts
between these and other customs authories.


Background to the state model
-----------------------------

Intel Corporation created
an open source reference implementation
of a generic supply chain transaction
using private blockchain technology
Called Sawtooth Supply Chain

(TODO insert links to github etc)

This was used internally in 2018
by the Australian Government (Department of Home Affairs)
to evaluate the concept of using
private blockchain technology
to facilitate trusted document exchange
between customs authorities.

The design of Intel's Sawtooth Supply Chain is generic,
meaning it supports many styles of transaction
including, but not limited too,
transactions that seemed adequate
for inter-customs document exchange.

Key ideas carried forward
from the reference implementation
included:

 * Distingushing "Ownership" vs "Custodianship"
   of the transaction contract.
 * Using a concept of "Proposals"
   by the owner (or custodian) of a contract
   which are explicitly accepted or rejected
   by the recipient of ownership (or custodianship)

TODO: state machine diagram (or petri-net diagram) showing custody and ownership changes.


Generic Inter-Customs Ledger State Model
----------------------------------------

We created a restricted version
of the generic supply chain model
that we thought might be appropriate
for Inter-Customs document exchange.

Generic ICL roles:

 * Export Deletaged Authority (EDA)
 * Export Customs Authority (ECA)
 * Import Customs Authority (ICA)

The basic flow is:

 1. EDA created an Unverified CoO.
 2. ECA verifies the CoO.
 3. ICA acknowledges the CoO.
 4. ECA relinquishes custody of the CoO to the ICA.
 5. ICA acquits the CoO.


EDA Creates Unverified CoO
^^^^^^^^^^^^^^^^^^^^^^^^^^

The Export Delegated Authority
creates a new CoO
based on evidence provided to them
by an exporter,
using processes that are regulated
by the Export Customs Authority.

As a result of this, three transactions
have been effected by the EDA

 * An "Unverified CoO" is created.
 * A Change of Ownership Proposal is created
   (from the EDA to the Import Customs Authority).
 * A change of Custody Proposal is created
   (from the EDA to the Export Customs Authority).

Unlike the generic supply chain model,
this is the only Change of Onwership
proposal that is possible
(From the EDA to the ICA).
Similarly, the EDA->ECA change of custody proposal
is one of only two in the inter-customs context
(the other is ECA->ICA).


EDA Verifies the CoO
^^^^^^^^^^^^^^^^^^^^

At the end of the previous step,
A new Unverified CoO exists
and there is a coresponding
change of custody proposal
from the EDA to the ECA.

By accepting this proposal,
the ECA effectively provides verification.

It seems likley
this would be automated
based on some simple rules
such as checking the currency
of the delegated authority.
However, the ECA's can refuse
(or postpone acceptance) for any reson.


ICA Acknowledges the CoO
^^^^^^^^^^^^^^^^^^^^^^^^

The ECA's CoO custody acceptance
is a signal to the ICA,
that tells them
that the ECA considers the CoO satisfactory.

By accepting the CoO ownership proposal
from the EDA,
The ICA effectively sends an acknowledgement
to the ECA.

Discussion:
 * Should the contract allow acceptance of the EDA->ICA ownership proposal _before_
   the EDA->ECA custody proposal is accepted?

At this point, the state of the smart contract is:

 * EDA created the contract, but is no longer owns it nor has custody of it
 * The ECA has custody of the contract
 * The ICA owns the contract

This is considered necessary and sufficient preconditions for export to occur.


ECA relinquishes custody of the CoO to the ICA
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This is an obtuse way of saying that the "export occurs".
Or, it's an obtuse way of saying "the export becomes an import".
TODO: explain that without using the word "obtuse".


Presumably, there is some "offline process"
(historically paper based but potentially digital)
that indicates to the ECA that the export is happening.
It may involve an "Export Declaration"
being lodged with the ECA.
However this works is outside the scope of the ledger,
except that once it has happened
the ECA signals to the ICA that the export
has left their jurisdiction and control.

The ECA does this by proposing
that the ICA takes custody of the contract.
At this point,
the transaction starts transitioning
from being an export to being an import.

Presumably some time later,
when the ICO considers the cargo is within their jurisdiction and/or control,
they may signal this to the ECO by accepting custody of the contract.


ICA acquits the CoO 
^^^^^^^^^^^^^^^^^^^

Because the ICA is now both owner
and has custody of the contract,
they have the ability to finalize it.

This is a one-time operation
that indicates that
the import has occured.

DISCUSSION:
 * should we replace the word "finalize" with "acquit" throughout
 * should we suggest finalization/acquittal carries a significant signal, e.g. goods released to importer (or seized/destroyed, i.e. that the import stage of the process is complete)?


 
