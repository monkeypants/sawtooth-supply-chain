
![Hyperledger Sawtooth](images/sawtooth_logo_light_blue-small.png)

This is a fork of [sawtooth-supply-chain](https://github.com/hyperledger/sawtooth--supply-chain)
that removes their fish demo app, and replaces it with a Certificate demo app.

In this use-case, a "Certificate" is a thing that is issued by an exporting country. E.g:

 * Issued in an Export country, by a delegated authority (e.g. on behalf of the Export Country Government, as an implementation of a condition of a trade agreement between two countries)
 * Transfered (ownership) to the Customs Authority of the import country based on the *intent* of the exporter.
 * Transfered (custodianship) to the Customs Authority of the import country based on *movement of physical goods* into their control.
 * Finalisedby the import country Customs Authority upon release to the Importer, to prevent "double spend".

The purpose of this solution is a demonstration of concept, it is not a production-ready solution for Customs Authorities! A number of details have been glossed-over, and important features are missing. The intent is to help people visualise and understand how "certification as a digital assets" could be used to streamline trade operations by reducing confusion, delays and ambiguiry between authorities.

To run this demo, first run the `hyperledger/sawtooth-supply-chain` sample app, then run this one substituting "cert" (or "certs" where plural) for "fish" in the various commands.
