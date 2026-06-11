Act as a senior Node.js backend engineer.

Code is already written, respect it, you need just change it according to api specification
Create a complete mock implementation of the TÜBİTAK API using:

- Node.js 22+
- TypeScript
- Express.js
- TypeORM
- SQLite
- class-validator

Requirements:

1.  Project Structure
    - Generate a production-quality folder structure.
    - Follow existing structure

2.  Database
    - Use SQLite with TypeORM.
    - Seed sample data automatically.

3.  API Mocking
    - Implement all endpoints described below.
    - Responses must closely mimic the real TÜBİTAK API behavior.
    - Include realistic mock data.

4.  Error Handling
    - Respect tubitak error resppone interface.

5.  API Specification PDF file
    Read TravelRuleAPI.pdf for specification

        OUT OF CLASSIFICATION

    TÜBİTAK BİLGEM
    PUBLIC CERTIFICATION AUTHORITY
    TRAVEL RULE TRSP SERVICES
    Revision No
    13
    Revision Date
    24.02.2026
    OUT OF CLASSIFICATION
    TASNİF DIŞI
    1/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
    Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
    OUT OF CLASSIFICATION
    TrTRAVEL RULE KTDM SERVISLERI
    TRAVEL RULE KTDM SERVISLERI
    REVISION HISTORY
    Revision No Revision Reason Revision Date
    01 First Release 24.02.2025
    02 The service for retrieving the VASP list has been added 12.03.2025
    03 The service for obtaining the VASP Certificate has been added 08.04.2025
    04 16.05.2025
    05 2.2.4 Example of PII Encrypted Input has been updated. 21.05.2025
    06 Added rule details to status descriptions. 03.06.2025
    07 1 JWT TOKEN RETRIEVAL - Response/Output parameters have been
    updated.
    25.06.2025
    08
    3.2.3 Status Descriptions and Status Transition has been updated.
    7 Inquiry of Travel Rule Request Status Information has been added
    8 The Service Output Messages table has been updated.
    24.07.2025
    09
    Added transactionAssetTag and transactionAssetNetwork parameters to
    the Transmisison of Encrypted Transfer Data to TRSP Service
    14.08.2025
    10
    2 Transmission of Encrypted Transfer Data to TRSP has been updated,
    the requirement for the piiSchemaVersion field in the data attributes has
    been removed.
    The piiSchemaVersion field example has been updated in the input
    examples
    10.09.2025
    11
    The expression 'TAXN' has been updated to 'TXID' in the description and
    table under the heading '2.1.2 Additional Field Properties for Legal
    Entities'.
    Error code '9911 Invalid Update Request' has been removed.
    22.01.2026
    TASNİF DIŞI
    2/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
    Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
    OUT OF CLASSIFICATION
    TrTRAVEL RULE KTDM SERVISLERI
    TRAVEL RULE KTDM SERVISLERI
    12 8 TRAVEL RULE CREDIT INQUIRY SERVICE and 9 TRAVEL RULE TRAVEL
    RULE BLOCKCHAIN NETWORK LISTING SERVICE have been added.
    23.02.2026
    13
    10 TRAVEL RULE CANCEL SERVICE has been added.
    OriginatorPersons.geographicAddress.country field under the header
    2.1.1 IVMS101 PII DATA (pii object) has been updated so that it is
    encrypted.
    2.1 Input Parameters table under the header 2 Transmission of
    Encrypted Transfer Data to TRSP has been updated, the requirement for
    the transactionAssetNetwork field in the data attributes has been added.
    24.02.2026
    TASNİF DIŞI
    3/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
    Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
    OUT OF CLASSIFICATION
    TrTRAVEL RULE KTDM SERVISLERI
    TRAVEL RULE KTDM SERVISLERI
    1 JWT TOKEN RETRIEVAL
    Before invoking TRSP services, it is required to obtain a JWT token using the username and password. For
    subsequent requests, services should be called using the JWT token.
    Url: https://ktdm-test.kamusm.gov.tr/api/auth/login
    Http Method:@POST
    1.1 Input Parameters
    Field Type Required
    username String Yes
    password String Yes
    Input
    {
    "username":"user123",
    "password":"11111111"
    }
    Response/Output
    {
    "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0IiwiaWF0IjoxNzQwNDY3MTI0LCJleHAiOjE3NDA0NjcxNTR9.QfL2y
    \_zYDDoP28OCwkDw\_\_tpMRNHjXpACaTT9C1fxKc",
    "token_type": "Bearer",
    "expires_in": 300
    }
    Note: The unit of the expires_in parameter is seconds.
    TASNİF DIŞI
    4/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
    Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
    OUT OF CLASSIFICATION
    TrTRAVEL RULE KTDM SERVISLERI
    TRAVEL RULE KTDM SERVISLERI
    2 TRANSMISISON OF ENCRYPTED TRANSFER DATA TO TRSP
    It is invoked by the Originating VASP to initiate the Travel Rule. It is provided by TRSP.
    Url: https://ktdm-test.kamusm.gov.tr/api/v1/ktdm/tr/create
    Http Method:@POST
    2.1 Input Parameters
    Field Type Required Description Encrypted
    piiEncryptionSpec ObjectPIIEncryptionSpec
    Yes Information about the algorithm
    used to encrypt Personally
    Identifiable Information (PII)
    data.
    No
    piiEncryptionSpec.
    base64EncodedEphemeralP
    ublicKey
    String Yes key used for encryption No
    piiEncryptionSpec.
    encryptionAlgorithm
    String Yes Algorithm Name: ECIES No
    piiEncryptionType String Yes It takes two values: FIELD and
    OBJECT. If FIELD is selected, each
    field within the PII request is
    encrypted separately and
    transmitted. If OBJECT is
    selected, the entire PII request is
    encrypted as a whole and
    transmitted through the
    piiEncryptedPayload field. The
    beneficiary VASP can determine
    the decryption method based on
    the value of this field.
    No
    piiSchemaVersion String No IVMS101 schema version used
    for encrypting PII data
    No
    transactionRef String For Customer-toCustomer
    transactions, No
    for VASP-to-VASP
    transactions, Yes
    A unique reference number for
    the transaction (generated by
    the Originating VASP)
    No
    transactionAsset String Yes Type of crypto asset traded (e.g.
    BTC, ETH, etc.)
    No
    transactionAssetTag String No On some blockchain networks
    such as XRP, XLM and EOS the
    same wallet address serves
    multiple users. In such cases, a
    memo/tag field is required to
    route the funds to the correct
    sub-account.
    No
    TASNİF DIŞI
    5/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
    Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
    OUT OF CLASSIFICATION
    TrTRAVEL RULE KTDM SERVISLERI
    TRAVEL RULE KTDM SERVISLERI
    transactionAssetNetwork String Yes An asset (e.g. USDT) can be
    issued on multiple networks
    (ERC-20, TRC-20, BEP-20 etc.).
    This parameter specifies the
    correct network to ensure the
    transfer is performed on the
    intended blockchain.
    No
    transactionAssetDecimals Number No Decimal precision of the asset
    involved in the transaction
    No
    transactionAmount String Yes Transaction amount Yes
    chargedQuantity String No Fees deducted before the
    amount reaches the beneficiary
    Yes
    amountInLocalCurrency Object -
    AmountInLocalCurr
    ency
    No Local currency and transaction
    amount
    amountInLocalCurrency.cur
    rency
    String If the associated
    object is entered, Yes
    Local currency name (e.g., USD,
    EUR, etc.)
    No
    amountInLocalCurrency.
    amountInLocalCurrency
    Number
    (BigDecimal)
    If the associated
    object is entered, Yes
    Amount corresponding to the
    local currency
    Yes
    beneficiaryAmountInLocalC
    urrency
    Object -
    AmountInLocalCurr
    ency
    No
    beneficiaryAmountInLocalC
    urrency.currency
    String If the associated
    object is entered, Yes
    Local currency name (e.g., USD,
    EUR, etc.)
    No
    beneficiaryAmountInLocalC
    urrency.
    amountInLocalCurrency
    Number
    (BigDecimal)
    If the associated
    object is entered, Yes
    Amount corresponding to the
    local currency
    Yes
    originatorDid String No DID address of the party
    initiating the transaction
    Yes
    beneficiaryDid String No DID address of the beneficiary Yes
    originatorVASPdid String Yes DID address of the initiating
    VASP
    No
    beneficiaryVASPdid String Yes Beneficiary VASP's DID address No
    beneficiaryRef String No An email address or reference ID
    for the beneficiary
    Yes
    originatorRef String No An email address or reference ID
    for the originator
    Yes
    transactionBlockchainInfo Object -
    TransactionBlockch
    ainInfo
    Yes Source and destination
    blockchain address information
    for the transaction
    transactionBlockchainInfo.o
    rigin
    String No Blockchain adress information of
    the originator
    Yes
    transactionBlockchainInfo.d
    estination
    String Yes Blockchain adress information of
    the beneficiary
    Yes
    TASNİF DIŞI
    6/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
    Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
    OUT OF CLASSIFICATION
    TrTRAVEL RULE KTDM SERVISLERI
    TRAVEL RULE KTDM SERVISLERI
    piiEncryptedPayload String No If the piiEncryptionType is set
    "Object", this field corresponds
    to the encrypted data of the
    encrypted PII data object and is
    completed with it.
    (Base64encodedString)
    Yes
    2.1.1 IVMS101 PII DATA (pii object)
    Field Type Required Description Encrypted
    originator Object -Person Yes Information about the
    originator
    Originator. originatorPersons List Yes Identity List Yes
    originatorPersons. naturalPerson Object -
    NaturalPerson
    Yes Natural Person
    naturalPerson.name.
    nameIdentifier
    Object -
    NameIdentifier
    Yes Originator’s first and last
    name
    naturalPerson.name.
    nameIdentifier. primaryIdentifier
    String Yes Last Name Yes
    naturalPerson.name.
    nameIdentifier. secondaryIdentifier
    string Yes Name Yes
    originatorPersons .
    geographicAddress
    Object -
    GeographicAddress
    No Originator 's address
    information
    Yes
    originatorPersons .
    geographicAddress. addressType
    String No Home address, work
    address, etc.
    Yes
    originatorPersons .
    geographicAddress. streetName
    String No Street Yes
    originatorPersons .
    geographicAddress. townName
    String No District / Town Name Yes
    originatorPersons .
    geographicAddress.
    countrySubDivision
    String No Province Name Yes
    TASNİF DIŞI
    7/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
    Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
    OUT OF CLASSIFICATION
    TrTRAVEL RULE KTDM SERVISLERI
    TRAVEL RULE KTDM SERVISLERI
    originatorPersons .
    geographicAddress. country
    String No Country (Country code
    must be in ISO 3166-1
    alpha-2 format)
    Yes
    originatorPersons .
    geographicAddress.
    buildingNumber
    String No Building Number Yes
    originatorPersons .
    geographicAddress. buildingName
    String No Building Name Yes
    originatorPersons .
    geographicAddress. postCode
    String No Post Code Yes
    originatorPersons.
    nationalIdentification
    Object -
    NationalIdentificati
    on
    No Official Identification
    Information
    Yes
    originatorPersons.
    nationalIdentification
    . countryOfIssue
    String No Country code issuing the
    identification. Must be in
    ISO 3166-1 alpha-2 format.
    Yes
    originatorPersons.
    nationalIdentification
    . nationalIdentifier
    string If
    nationalIdentification
    is to be sent, Yes
    Identification number: This
    can be a passport number,
    national identity card
    number, tax identification
    number, or driver's license
    number.
    Yes
    originatorPersons.
    nationalIdentification
    . nationalIdentifierType
    String If
    nationalIdentification
    is to be sent, Yes
    It must be one of the
    identity types supported by
    the IVMS101 standard
    (e.g., PASSPORT, NIDN,
    DRLC, etc.)
    Yes
    Originator.accountNumber Array-String No Originator's account
    number
    Yes
    beneficiary Object -Person Yes Beneficiary informations
    beneficiary. beneficiary
    Persons
    List Yes Yes
    beneficiary
    Persons.naturalPerson
    Object -
    NaturalPerson
    Yes Natural Person
    naturalPerson.name.
    nameIdentifier
    Object -
    NameIdentifier
    Yes Beneficiary’s first and last
    name
    TASNİF DIŞI
    8/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
    Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
    OUT OF CLASSIFICATION
    TrTRAVEL RULE KTDM SERVISLERI
    TRAVEL RULE KTDM SERVISLERI
    naturalPerson.name.
    nameIdentifier. primaryIdentifier
    String Yes Last Name Yes
    naturalPerson.name.
    nameIdentifier. primaryIdentifier
    string Yes Name Yes
    naturalPerson.dateAndPlaceOfBirt
    h
    Object -
    DateAndPlaceOfBirt
    h String (ISO 8601
    date format yyyymm-dd)
    No Birth Information
    naturalPerson.
    dateAndPlaceOfBirth. dateOfBirth
    String No Date of Birth Yes
    naturalPerson.
    dateAndPlaceOfBirth. placeOfBirth
    String No Place of Birth Yes
    beneficiaryPersons.
    geographicAddress
    Object -
    GeopgraphicAddres
    s
    No Beneficiary’s address
    information
    Yes
    beneficiaryPersons.
    geographicAddress. addressType
    String No Home address, work
    address, etc
    See: AddressType
    Abbreviations Table*
    Yes
    beneficiaryPersons.
    geographicAddress. streetName
    String No Street Yes
    beneficiaryPersons.
    geographicAddress. townName
    String No District / Town Name Yes
    beneficiaryPersons.
    geographicAddress.
    countrySubDivision
    String No Province Name Yes
    beneficiaryPersons.
    geographicAddress. country
    String No Country (Country code
    must be in ISO 3166-1
    alpha-2 format)
    Yes
    beneficiaryPersons.
    geographicAddress.
    buildingNumber
    String No Building Number Yes
    beneficiaryPersons.
    geographicAddress. buildingName
    String No Building Name Yes
    TASNİF DIŞI
    9/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
    Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
    OUT OF CLASSIFICATION
    TrTRAVEL RULE KTDM SERVISLERI
    TRAVEL RULE KTDM SERVISLERI
    beneficiaryPersons.
    geographicAddress. postCode
    String No Post Code Yes
    beneficiaryPersons.
    nationalIdentification
    Object -
    NationalIdentificati
    on
    No Official Identification
    Information
    Yes
    beneficiaryPersons.
    nationalIdentification
    . countryOfIssue
    String No Country code issuing the
    identification. Must be in
    ISO 3166-1 alpha-2 format.
    Yes
    beneficiaryPersons.
    nationalIdentification
    . nationalIdentifier
    string If
    nationalIdentification
    is to be sent, Yes
    Identification number: This
    can be a passport number,
    national identity card
    number, tax identification
    number, or driver's license
    number.
    Yes
    beneficiaryPersons.
    nationalIdentification
    . nationalIdentifierType
    String If
    nationalIdentification
    is to be sent, Yes
    It must be one of the
    identity types supported by
    the IVMS101 standard
    (e.g., PASSPORT, NIDN,
    DRLC, etc.)
    Yes
    beneficiary.accountNumber Array-String No Beneficiary Accout Number Yes
    2.1.2 Additional Field Properties for Legal Person
    Unlike Natural Person, countryOfRegistration and dateOfRegistration information are sent for Legal Person.
    For legal persons, instead of nationalIdentifier, tax ID number and for nationalIdentifierType, TXID may be
    appropriate.
    Field Type Required Description Encrypted
    Originator. originatorPersons List Yes Identity List Yes
    originatorPersons. legalPerson Object -LegalPerson Yes Legal Person
    legalPerson.name. nameIdentifier Object -
    NameIdentifier
    Yes Unique Identifier of
    Originator
    legalPerson.name. nameIdentifier.
    legalPersonName
    String Yes Legal Person Name
    (Company / Firm /
    Institution Name)
    Yes
    legalPerson. geographicAddress Object No Adress Information Yes
    legalPerson. nationalIdentification Object No For legal persons, instead
    of nationalIdentifier, tax ID
    number and for
    nationalIdentifierType,
    TXID
    Yes
    TASNİF DIŞI
    10/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
    Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
    OUT OF CLASSIFICATION
    TrTRAVEL RULE KTDM SERVISLERI
    TRAVEL RULE KTDM SERVISLERI
    legalPerson. countryOfRegistration String No Country of registration Yes
    legalPerson. dateOfRegistration String (ISO 8601
    date format yyyymm-dd)
    No Date of Registration Yes
    2.2 Example of HTTP Request
    2.2.1 Natural Person
    {
    "piiEncryptionSpec": {
    "base64EncodedEphemeralPublicKey":"QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7",
    "encryptionAlgorithm": "ECIES"
    },
    "piiEncryptionType": "FIELD",
    "piiSchemaVersion": "IVMS101.2020",
    "transactionRef": "random uuid generated by Sender VASP to track transactions",
    "transactionAsset": "BTC",
    "transactionAssetTag": "23564564",
    “transactionAssetNetwork": "ERC20",
    "transactionAssetDecimals": 8,
    "originatorDid": "did:ethr:werwerwerrtestest",
    "beneficiaryDid": "did:ethr:0x7sssewrwewtestsetst",
    "transactionAmount": "QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7",
    "originatorVASPdid": "did:ethr:originatorvaspdid",
    "beneficiaryVASPdid": "did:ethr:beneficiaryvaspdid",
    "beneficiaryRef": "QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7",
    "originatorRef": "QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7",
    "transactionBlockchainInfo": {
    "origin": "QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7",
    "destination": "QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7"
    },
    "piiEncryptedPayload": null,
    "pii": {
    "originator": {
    "originatorPersons": [
    {
    "naturalPerson": {
    "name": [
    {
    "nameIdentifier": [
    {
    "primaryIdentifier":
    "QmaXf1QniXUYJrJ2HoQ1gX6ixs2jaeK7N9DmQZFdkHEQuV",
    TASNİF DIŞI
    11/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
    Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
    OUT OF CLASSIFICATION
    TrTRAVEL RULE KTDM SERVISLERI
    TRAVEL RULE KTDM SERVISLERI
    "secondaryIdentifier":
    "QmaXf1QniXUYJrJ2HoQ1gX6ixs2jaeK7N9DmQZFdkHEQuV"
    }
    ]
    }
    ],
    "geographicAddress": [
    {
    "addressType": "QmYqpvqAqVjeFaaxHfJ98ogXm33Zr6p7PTnPbFL3txCAb3",
    "streetName": "QmYqpvqAqVjeFaaxHfJ98ogXm33Zr6p7PTnPbFL3txCAb3",
    "townName": "QmSgvT4ytZYmz1kduKqnqSA7S6Y6ArUPLWnrxP4M5ac6Ec",
    "country": "QmSgvT4ytZYmz1kduKqnqSA7S6Y6ArUPLWnrxP4M5ac6Ec",
    "buildingNumber": "QmPE2cEaAVpgqDCb9WmQo1wi2ohrNQu7Kr5yTq5GHeqFeR",
    "postCode": " QmPE2cEaAVpgqDCb9WmQo1wiwerw 24u7Kr5yTq5GHeqFeR"
    }
    ],
    "nationalIdentification": {
    "countryOfIssue": "QmYoMRBqhMU6G6MUGi1gStD9jb3faftkNmJJfabP3AVUzZ",
    "nationalIdentifier": "QmeqJe9WiKuLs1JBEZ1Hw8ByodDkgZF99sYgkhkBbpjeyQ",
    "nationalIdentifierType": "QmUmjHVJjRRFqny3Y6LQSyaiUM2HeatAAd21UWPheJ4p5n"
    }
    }
    }
    ],
    "accountNumber": [
    "QmVdWmpZ63DRexDJd9urjrxbotJNUNPLjyL6ZoDJHjBbhL"
    ]
    },
    "beneficiary": {
    "beneficiaryPersons": [
    {
    "naturalPerson": {
    "name": [
    {
    "nameIdentifier": [
    {
    "primaryIdentifier":
    "QmadD6L7QBuNHpPZvpdpaXck6ek57CWnS6Mijesd2g5FxN",
    "secondaryIdentifier":
    "QmV5MVcpyiCVaFVZNUNchTm3RnsprKzRj4qbYCYXHTDx5w"
    }
    ]
    }
    ],
    TASNİF DIŞI
    12/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
    Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
    OUT OF CLASSIFICATION
    TrTRAVEL RULE KTDM SERVISLERI
    TRAVEL RULE KTDM SERVISLERI
    "geographicAddress": [
    {
    "addressType": "QmYqpvqAqVjeFaaxHfJ98ogXm33Zr6p7PTnPbFL3txCAb3",
    "streetName": "QmYqpvqAqVjeFaaxHfJ98ogXm33Zr6p7PTnPbFL3txCAb3",
    "townName": "QmSgvT4ytZYmz1kduKqnqSA7S6Y6ArUPLWnrxP4M5ac6Ec",
    "country": "QmSgvT4ytZYmz1kduKqnqSA7S6Y6ArUPLWnrxP4M5ac6Ec",
    "buildingNumber": "QmPE2cEaAVpgqDCb9WmQo1wi2ohrNQu7Kr5yTq5GHeqFeR",
    "postCode": " QmPE2cEaAVpgqDCb9WmQo1wiwerw 24u7Kr5yTq5GHeqFeR"
    }
    ],
    "nationalIdentification": {
    "countryOfIssue": "QmYoMRBqhMU6G6MUGi1gStD9jb3faftkNmJJfabP3AVUzZ",
    "nationalIdentifier": "QmeqJe9WiKuLs1JBEZ1Hw8ByodDkgZF99sYgkhkBbpjeyQ",
    "nationalIdentifierType": "QmUmjHVJjRRFqny3Y6LQSyaiUM2HeatAAd21UWPheJ4p5n"
    }
    }
    }
    ],
    "accountNumber": [
    "QmaMkqN4xxxNoub2zffugtu7H1moofyMTH4SUVod2ZPe4A"
    ]
    }
    }
    }
    2.2.2 Legal Person
    {
    "piiEncryptionSpec": {
    "base64EncodedEphemeralPublicKey":"QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7",
    "encryptionAlgorithm": "ECIES"
    },
    "piiEncryptionType": "FIELD",
    "piiSchemaVersion": "IVMS101.2020",
    "transactionRef": "random uuid generated by Sender VASP to track transactions",
    "transactionAsset": "BTC",
    "transactionAssetTag": "23564564",
    “transactionAssetNetwork": "ERC20",
    "transactionAssetDecimals": 8,
    "originatorDid": "did:ethr:werwerwerrtestest",
    "beneficiaryDid": "did:ethr:0x7sssewrwewtestsetst",
    "transactionAmount": "QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7",
    "originatorVASPdid": "did:ethr:originatorvaspdid",
    TASNİF DIŞI
    13/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
    Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
    OUT OF CLASSIFICATION
    TrTRAVEL RULE KTDM SERVISLERI
    TRAVEL RULE KTDM SERVISLERI
    "beneficiaryVASPdid": "did:ethr:beneficiaryvaspdid",
    "beneficiaryRef": "QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7",
    "originatorRef": "QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7",
    "transactionBlockchainInfo": {
    "origin": "QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7",
    "destination": "QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7"
    },
    "piiEncryptedPayload": null,
    "pii": {
    "originator": {
    "originatorPersons": [
    {
    "legalPerson": {
    "name": [
    {
    "nameIdentifier": [
    {
    "legalPersonName": "QmaXf1QniXUYJrJ2HoQ1gX6ixs2jaeK7N9DmQZFdkHEQuV"
    }
    ]
    }
    ],
    "countryOfRegistration": "TR",
    "dateOfRegistration": "1999-10-10",
    "geographicAddress": [
    {
    "addressType": "QmYqpvqAqVjeFaaxHfJ98ogXm33Zr6p7PTnPbFL3txCAb3",
    "streetName": "QmYqpvqAqVjeFaaxHfJ98ogXm33Zr6p7PTnPbFL3txCAb3",
    "townName": "QmSgvT4ytZYmz1kduKqnqSA7S6Y6ArUPLWnrxP4M5ac6Ec",
    "country": "QmSgvT4ytZYmz1kduKqnqSA7S6Y6ArUPLWnrxP4M5ac6Ec",
    "buildingNumber": "QmPE2cEaAVpgqDCb9WmQo1wi2ohrNQu7Kr5yTq5GHeqFeR",
    "postCode": " QmPE2cEaAVpgqDCb9WmQo1wiwerw 24u7Kr5yTq5GHeqFeR"
    }
    ],
    "nationalIdentification": {
    "countryOfIssue": "QmYoMRBqhMU6G6MUGi1gStD9jb3faftkNmJJfabP3AVUzZ",
    "nationalIdentifier": "QmeqJe9WiKuLs1JBEZ1Hw8ByodDkgZF99sYgkhkBbpjeyQ",
    "nationalIdentifierType": "QmUmjHVJjRRFqny3Y6LQSyaiUM2HeatAAd21UWPheJ4p5n"
    }
    }
    }
    ],
    "accountNumber": [
    TASNİF DIŞI
    14/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
    Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
    OUT OF CLASSIFICATION
    TrTRAVEL RULE KTDM SERVISLERI
    TRAVEL RULE KTDM SERVISLERI
    "QmVdWmpZ63DRexDJd9urjrxbotJNUNPLjyL6ZoDJHjBbhL"
    ]
    },
    "beneficiary": {
    "beneficiaryPersons": [
    {
    "naturalPerson": {
    "name": [
    {
    "nameIdentifier": [
    {
    "primaryIdentifier":
    "QmadD6L7QBuNHpPZvpdpaXck6ek57CWnS6Mijesd2g5FxN",
    "secondaryIdentifier":
    "QmV5MVcpyiCVaFVZNUNchTm3RnsprKzRj4qbYCYXHTDx5w"
    }
    ]
    }
    ],
    "geographicAddress": [
    {
    "addressType": "QmYqpvqAqVjeFaaxHfJ98ogXm33Zr6p7PTnPbFL3txCAb3",
    "streetName": "QmYqpvqAqVjeFaaxHfJ98ogXm33Zr6p7PTnPbFL3txCAb3",
    "townName": "QmSgvT4ytZYmz1kduKqnqSA7S6Y6ArUPLWnrxP4M5ac6Ec",
    "country": "QmSgvT4ytZYmz1kduKqnqSA7S6Y6ArUPLWnrxP4M5ac6Ec",
    "buildingNumber": "QmPE2cEaAVpgqDCb9WmQo1wi2ohrNQu7Kr5yTq5GHeqFeR",
    "postCode": " QmPE2cEaAVpgqDCb9WmQo1wiwerw 24u7Kr5yTq5GHeqFeR"
    }
    ],
    "nationalIdentification": {
    "countryOfIssue": "QmYoMRBqhMU6G6MUGi1gStD9jb3faftkNmJJfabP3AVUzZ",
    "nationalIdentifier": "QmeqJe9WiKuLs1JBEZ1Hw8ByodDkgZF99sYgkhkBbpjeyQ",
    "nationalIdentifierType": "QmUmjHVJjRRFqny3Y6LQSyaiUM2HeatAAd21UWPheJ4p5n"
    }
    }
    }
    ],
    "accountNumber": [
    "QmaMkqN4xxxNoub2zffugtu7H1moofyMTH4SUVod2ZPe4A"
    ]
    }
    }
    }
    TASNİF DIŞI
    15/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
    Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
    OUT OF CLASSIFICATION
    TrTRAVEL RULE KTDM SERVISLERI
    TRAVEL RULE KTDM SERVISLERI
    2.2.3 Natural Person – Optional Date of Birth
    {
    "piiEncryptionSpec": {
    "base64EncodedEphemeralPublicKey":"QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7",
    "encryptionAlgorithm": "ECIES"
    },
    "piiEncryptionType": "FIELD",
    "piiSchemaVersion": "IVMS101.2020",
    "transactionRef": "random uuid generated by Sender VASP to track transactions",
    "transactionAsset": "BTC",
    "transactionAssetDecimals": 8,
    "originatorDid": "did:ethr:werwerwerrtestest",
    "beneficiaryDid": "did:ethr:0x7sssewrwewtestsetst",
    "transactionAmount": "QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7",
    "originatorVASPdid": "did:ethr:originatorvaspdid",
    "beneficiaryVASPdid": "did:ethr:beneficiaryvaspdid",
    "beneficiaryRef": "QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7",
    "originatorRef": "QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7",
    "transactionBlockchainInfo": {
    "origin": "QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7",
    "destination": "QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7"
    },
    "piiEncryptedPayload": null,
    "pii": {
    "originator": {
    "originatorPersons": [
    {
    "naturalPerson": {
    "name": [
    {
    "nameIdentifier": [
    {
    "primaryIdentifier":
    "QmaXf1QniXUYJrJ2HoQ1gX6ixs2jaeK7N9DmQZFdkHEQuV",
    "secondaryIdentifier":
    "QmaXf1QniXUYJrJ2HoQ1gX6ixs2jaeK7N9DmQZFdkHEQuV"
    }
    ]
    }
    ],
    "geographicAddress": [
    {
    TASNİF DIŞI
    16/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
    Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
    OUT OF CLASSIFICATION
    TrTRAVEL RULE KTDM SERVISLERI
    TRAVEL RULE KTDM SERVISLERI
    "addressType": "QmYqpvqAqVjeFaaxHfJ98ogXm33Zr6p7PTnPbFL3txCAb3",
    "streetName": "QmYqpvqAqVjeFaaxHfJ98ogXm33Zr6p7PTnPbFL3txCAb3",
    "townName": "QmSgvT4ytZYmz1kduKqnqSA7S6Y6ArUPLWnrxP4M5ac6Ec",
    "country": "QmSgvT4ytZYmz1kduKqnqSA7S6Y6ArUPLWnrxP4M5ac6Ec",
    "buildingNumber": "QmPE2cEaAVpgqDCb9WmQo1wi2ohrNQu7Kr5yTq5GHeqFeR",
    "postCode": " QmPE2cEaAVpgqDCb9WmQo1wiwerw 24u7Kr5yTq5GHeqFeR"
    }
    ],
    "nationalIdentification": {
    "countryOfIssue": "QmYoMRBqhMU6G6MUGi1gStD9jb3faftkNmJJfabP3AVUzZ",
    "nationalIdentifier": "QmeqJe9WiKuLs1JBEZ1Hw8ByodDkgZF99sYgkhkBbpjeyQ",
    "nationalIdentifierType": "QmUmjHVJjRRFqny3Y6LQSyaiUM2HeatAAd21UWPheJ4p5n"
    },
    "dateAndPlaceOfBirth": {
    "dateOfBirth": "1999-01-01",
    "placeOfBirth": "TZ"
    }
    }
    }
    ],
    "accountNumber": [
    "QmVdWmpZ63DRexDJd9urjrxbotJNUNPLjyL6ZoDJHjBbhL"
    ]
    },
    "beneficiary": {
    "beneficiaryPersons": [
    {
    "naturalPerson": {
    "name": [
    {
    "nameIdentifier": [
    {
    "primaryIdentifier":
    "QmadD6L7QBuNHpPZvpdpaXck6ek57CWnS6Mijesd2g5FxN",
    "secondaryIdentifier":
    "QmV5MVcpyiCVaFVZNUNchTm3RnsprKzRj4qbYCYXHTDx5w"
    }
    ]
    }
    ],
    "geographicAddress": [
    {
    "addressType": "QmYqpvqAqVjeFaaxHfJ98ogXm33Zr6p7PTnPbFL3txCAb3",
    "streetName": "QmYqpvqAqVjeFaaxHfJ98ogXm33Zr6p7PTnPbFL3txCAb3",
    TASNİF DIŞI
    17/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
    Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
    OUT OF CLASSIFICATION
    TrTRAVEL RULE KTDM SERVISLERI
    TRAVEL RULE KTDM SERVISLERI
    "townName": "QmSgvT4ytZYmz1kduKqnqSA7S6Y6ArUPLWnrxP4M5ac6Ec",
    "country": "QmSgvT4ytZYmz1kduKqnqSA7S6Y6ArUPLWnrxP4M5ac6Ec",
    "buildingNumber": "QmPE2cEaAVpgqDCb9WmQo1wi2ohrNQu7Kr5yTq5GHeqFeR",
    "postCode": " QmPE2cEaAVpgqDCb9WmQo1wiwerw 24u7Kr5yTq5GHeqFeR"
    }
    ],
    "nationalIdentification": {
    "countryOfIssue": "QmYoMRBqhMU6G6MUGi1gStD9jb3faftkNmJJfabP3AVUzZ",
    "nationalIdentifier": "QmeqJe9WiKuLs1JBEZ1Hw8ByodDkgZF99sYgkhkBbpjeyQ",
    "nationalIdentifierType": "QmUmjHVJjRRFqny3Y6LQSyaiUM2HeatAAd21UWPheJ4p5n"
    }
    }
    }
    ],
    "accountNumber": [
    "QmaMkqN4xxxNoub2zffugtu7H1moofyMTH4SUVod2ZPe4A"
    ]
    }
    }
    }
    2.2.4 Example of PII Encrypted Input
    {
    "piiEncryptionSpec": {
    "base64EncodedEphemeralPublicKey":"QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7",
    "encryptionAlgorithm": "ECIES"
    },
    "piiEncryptionType": "FIELD",
    "piiSchemaVersion": "IVMS101.2020",
    "transactionRef": "random uuid generated by Sender VASP to track transactions",
    "transactionAsset": "BTC",
    "transactionAssetTag": "23564564",
    “transactionAssetNetwork": "ERC20",
    "transactionAssetDecimals": 8,
    "originatorDid": "did:ethr:werwerwerrtestest",
    "beneficiaryDid": "did:ethr:0x7sssewrwewtestsetst",
    "transactionAmount": "QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7",
    "originatorVASPdid": "did:ethr:originatorvaspdid",
    "beneficiaryVASPdid": "did:ethr:beneficiaryvaspdid",
    "beneficiaryRef": "QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7",
    "originatorRef": "QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7",
    TASNİF DIŞI
    18/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
    Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
    OUT OF CLASSIFICATION
    TrTRAVEL RULE KTDM SERVISLERI
    TRAVEL RULE KTDM SERVISLERI
    "transactionBlockchainInfo": {
    "origin": "QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7",
    "destination": "QmanABAgfKjtGQs5ZwN2GWqisgxysFanV6ReiFnsT1D8q7"
    },
    "piiEncryptedPayload": "BASE64EncodedString"
    }
    2.2.5 Response/Output
    Field Type Required Description Encrypted
    message Object- Message No It contains information related to the
    service response.
    For error codes, See: Message Codes
    Table*
    No
    message.code String Yes Service Message Code No
    Message.mesage String Yes Service Message Detail No
    Message.message String Yes The type of message (Exp; WARN,
    ERROR, INFO, SUCCESS)
    No
    messages List - Messages No It can be added to the output when
    multiple service messages are
    required.
    No
    status String Yes When a Travel Rule is initially created,
    its status is set to NEW.
    No
    TransactionType String Yes A fixed value as TRAVELRULE No
    id string Yes A unique identifier for each TR
    created by the TRSP and transmitted
    to the parties when the Travel Rule is
    initiated.
    No
    Successful
    {
    "message": {
    "code": "00",
    "message": "Creating Travel Rule completed.",
    "type": "SUCCESS"
    },
    "messages": null,
    "status": "NEW",
    "transactionType": "TRAVELRULE",
    "id": "fa18415b-2f0a-4d9f-aab2-4eab432f4205"
    }
    TASNİF DIŞI
    19/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
    Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
    OUT OF CLASSIFICATION
    TrTRAVEL RULE KTDM SERVISLERI
    TRAVEL RULE KTDM SERVISLERI
    Validation Failed
    If the required fields are not included in the sent request:
    {
    "message": {
    "code": "400",
    "message": "Invalid Request",
    "type": "MethodArgumentNotValidException"
    },
    "messages": [
    {
    "message": "transactionAsset: transactionAsset cannot be null or empty",
    "type": "validation"
    },
    {
    "message": "originatorVASPdid: originatorVASPdid cannot be null or empty",
    "type": "validation"
    }
    ]
    }
    Travel Rule Creation Failed
    The request has been sent, but an error occurred on the VASP side:
    {
    "message": {
    "code": "9900",
    "message": "Error at creating travel rule",
    "type": "TravelRuleSaveExcepiton"
    },
    "messages": null
    }
    TASNİF DIŞI
    20/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
    Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
    OUT OF CLASSIFICATION
    TrTRAVEL RULE KTDM SERVISLERI
    TRAVEL RULE KTDM SERVISLERI
    3 TRANSMISSION THE VERIFICATION RESULT TO VASP (CONFIRM /ACCEPTED/ REJECTED/
    DECLINED /NOT_READY)
    After receiving a notification that the Travel Rule has been initiated, VASP performs address and identity
    verification on its side. After verification, it is the services that transmit the verification result to TRSP, which
    is provided by TRSP.
    The CONFIRM and REJECTED statuses are used only for verifying wallet address ownership:
    CONFIRM: The beneficiary VASP indicates that the wallet address is under its control.
    REJECTED: The beneficiary VASP indicates that the address does not belong to its systems.
    These two statuses are used in the initial phase of communication under the Travel Rule to mutually verify
    address ownership. After the TR message is sent, it is possible to check the address in the first stage with
    these statuses.
    Once address ownership has been verified, AML (Anti-Money Laundering) and other compliance checks are
    performed. After these checks:
    ACCEPTED: The beneficiary VASP confirms that the address belongs to them and that AML checks have
    passed successfully, thus accepting the transfer.
    DECLINED: The beneficiary VASP rejects the transaction based on AML results, indicating that the transfer
    is not allowed.
    Summary of the Process
    Address Ownership Verification: CONFIRM / REJECTED
    Post-AML Decision: ACCEPTED / DECLINED
    TASNİF DIŞI
    21/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
    Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
    OUT OF CLASSIFICATION
    TrTRAVEL RULE KTDM SERVISLERI
    TRAVEL RULE KTDM SERVISLERI
    3.1 Parameters
    3.1.1 (CONFIRM/ACCEPTED/NOT_READY)
    Field Type Required Description Encrypted
    id String Yes id sent by TRSP as a result of the
    Create Request
    No
    3.1.2 (REJECT/DECLINE)
    Field Type Required Description Encrypted
    id String Yes id sent by TRSP as a result of the
    Create Request
    No
    reason String No For situations such as Rejection
    and Approval. For situations where
    it is desired to state the reason
    No
    3.2 Example of Http Request
    3.2.1 (CONFIRM/ACCEPTED/NOT_READY)
    {
    "id": "6ddc80d1-6ea0-4e51-bc80-966669001c40"
    }
    3.2.2 (REJECT/DECLINE)
    {
    "id": "6ddc80d1-6ea0-4e51-bc80-966669001c40"
    "reason": "isteğe bağlı bir metin"

}
For each of the following situations, an API endpoint will be provided by TRSP, and VASPs will call the respective
service for each situation.
TASNİF DIŞI
22/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
OUT OF CLASSIFICATION
TrTRAVEL RULE KTDM SERVISLERI
TRAVEL RULE KTDM SERVISLERI
3.2.3 Status Descriptions and Status Transition Rules
The Travel Rule status transitions for the services to be invoked for status updates are specified under the
following headings.
CONFIRM/ACK (ACKNOWLEDGED): The beneficiary VASP confirms that it controls the destination wallet
address. (i.e., “Yes, this wallet address belongs to me”)
**If the current Travel Rule status is either 'NEW' or 'NOT_READY', a success message is returned; otherwise,
a failure message is returned.
URL: https://ktdm-test.kamusm.gov.tr/api/v1/ktdm/tr/confirm
Http Method:@POST
ACCEPTED: The beneficiary VASP accepts the value transfer request initiated by the originating VASP. (i.e., “I
approve this transaction, the blockchain transfer may proceed”)
** If the current Travel Rule status is 'NEW', 'ACKNOWLEDGED', or 'NOT\*READY', a success message is
returned; otherwise, a failure message is returned. If a Travel Rule with an inappropriate status needs to be
moved to 'ACCEPTED', a new Travel Rule must be created.
URL: https://ktdm-test.kamusm.gov.tr/api/v1/ktdm/tr/accept
Http Method:@POST
DECLINED: The beneficiary VASP rejects the value transfer request from the originating VASP. (i.e., “I do not
wish to proceed with this transaction”)
**If the current Travel Rule status is 'NEW', 'ACKNOWLEDGED', or 'NOT_READY', a success message is returned;
otherwise, a failure message is returned.
URL: https://ktdm-test.kamusm.gov.tr/api/v1/ktdm/tr/decline
Http Method:@POST
REJECTED: The beneficiary VASP declares that it does not control the destination wallet address. (i.e., “This
wallet does not belong to me, I cannot proceed with this transaction”)
**If the current Travel Rule status is 'NEW', 'ACKNOWLEDGED', or 'NOT_READY', a success message is returned;
otherwise, a failure message is returned.
URL: https://ktdm-test.kamusm.gov.tr/api/v1/ktdm/tr/reject
Http Method:@POST
TASNİF DIŞI
23/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
OUT OF CLASSIFICATION
TrTRAVEL RULE KTDM SERVISLERI
TRAVEL RULE KTDM SERVISLERI
NOT_READY: The beneficiary VASP is currently not ready to respond to Travel Rule messages. (i.e., “I am not
in a position to evaluate this transaction right now”) \*_ If the current Travel Rule status is 'NEW', a success message is returned; otherwise, a failure message is
returned.
URL: https://ktdm-test.kamusm.gov.tr/api/v1/ktdm/tr/notready
Http Method:@POST
Description:
The CONFIRM and REJECTED statuses are used only for verifying wallet address ownership:
CONFIRM: The beneficiary VASP indicates that the wallet address is under its control.
REJECTED: The beneficiary VASP indicates that the address does not belong to its systems.
These two statuses are used in the initial phase of communication under the Travel Rule to mutually verify
address ownership. After the TR message is sent, it is possible to check the address in the first stage with
these statuses.
Once address ownership has been verified, AML (Anti-Money Laundering) and other compliance checks are
performed. After these checks:
ACCEPTED: The beneficiary VASP confirms that the address belongs to them and that AML checks have
passed successfully, thus accepting the transfer.
DECLINED: The beneficiary VASP rejects the transaction based on AML results, indicating that the transfer
is not allowed.
Summary of the Process
Address Ownership Verification: CONFIRM / REJECTED
Post-AML Decision: ACCEPTED / DECLINED
TASNİF DIŞI
24/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
OUT OF CLASSIFICATION
TrTRAVEL RULE KTDM SERVISLERI
TRAVEL RULE KTDM SERVISLERI
3.3 Response/Output
Field Type Required Description Encrypted
message Object- Message No It contains information
related to the service
response. For error codes,
See: Message Codes Table_
No
message.code String Yes Service Message Code No
Message.mesage String Yes Service Message Detail No
Message.message String Yes The type of message (Exp;
WARN, ERROR, INFO,
SUCCESS)
No
messages List - Messages No It can be added to the output
when multiple service
messages are required.
No
status String Yes When a Travel Rule is initially
created, its status is set to
NEW.
No
TransactionType String Yes A fixed value as TRAVELRULE No
id string Yes id sent by TRSP as a result of
the Create Request
No
Successful
{
"message": {
"code": "00",
"message": "Travel Rule Status Update completed.",
"type": "SUCCESS"
},
"messages": null,
"status": "ACKNOWLEDGED",
"transactionType": "TRAVELRULE",
"id": "b0f117d7-93e2-4046-823b-ac9c5fd5c61e"
}
\_The status value is written to the output based on the above-mentioned situation descriptions.
Failed
{
"message": {
"code": "9912",
"message": "Travel Rule status can not be updated because its current status is
'ACCEPTED'.",
"type": "TravelRuleCanNotBeUpdatedException"
},
"messages": null
}
TASNİF DIŞI
25/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
OUT OF CLASSIFICATION
TrTRAVEL RULE KTDM SERVISLERI
TRAVEL RULE KTDM SERVISLERI
4 RECORDING THE TRANSFER TRANSACTION IN TRSP
After the originating VASP receives the successful address and identity verification notification from TRSP, if
the verification result is successful (ACCEPTED), it initiates the transfer via blockchain and calls this service to
update the travel status.
Url: https://ktdm-test.kamusm.gov.tr/api/v1/ktdm/tr/update
Http Method:@POST
4.1 Field Properties and Examples of Http Request
Field Type Required Description Encrypted
id String Yes id sent by TRSP as a result of the
Create Request
No
txHash String Yes A unique value for the blockchain
transfer which is initiated by
Originating VASP
No
4.1.1 Example of Http Request
{
"id": "6ddc80d1-6ea0-4e51-bc80-966669001c40",
"txHash": "blockchaintransacitonid",
}
4.2 Response/Output
Field Type Required Description Encrypted
message Object- Message No It contains information related to
the service response. For error
codes, See: Message Codes Table\*
No
message.code String Yes Service Message Code No
Message.mesage String Yes Service Message Detail No
Message.message String Yes The type of message (Exp; WARN,
ERROR, INFO, SUCCESS)
No
messages List - Messages No It can be added to the output
when multiple service messages
are required.
No
status String No When a Travel Rule is initially
created, its status is set to NEW.
No
TransactionType String Yes A fixed value as TRAVELRULE No
id string Yes id sent by TRSP as a result of the
Create Request
No
TASNİF DIŞI
26/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
OUT OF CLASSIFICATION
TrTRAVEL RULE KTDM SERVISLERI
TRAVEL RULE KTDM SERVISLERI
{
"message": {
"code": "00",
"message": "Travel Rule Blockchain txHash Update completed.",
"type": "SUCCESS"
},
"messages": null,
"status": "ACCEPTED",
"transactionType": "TRAVELRULE",
"id": "b0f117d7-93e2-4046-823b-ac9c5fd5c61e"
}
5 RETRIEVING THE LIST OF VASP
The list of all VASPs registered in the Travel Rule system can be retrieved through this service.
URL: https://ktdm-test.kamusm.gov.tr/api/v1/ktdm/tr/vasp-list
Http Method:@GET
JWT token must be included when sending the request. A response can be obtained by sending a GET
request to the URL without including any request body.
5.1 Response/Output
{
"message": {
"message": "2 adet tanımlı KVHS bulunmaktadır.",
"type": "INFO"
},
"messages": null,
"vaspList": [
{
"vaspCode": "KVHS TEST-01",
"vaspName": "Kamu SM Test KVHS"
},
{
"vaspCode": "KVHS TEST-02",
"vaspName": "Kamu SM Test KVHS-2"
}
]
}
TASNİF DIŞI
27/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
OUT OF CLASSIFICATION
TrTRAVEL RULE KTDM SERVISLERI
TRAVEL RULE KTDM SERVISLERI
6 RETRIEVING THE VASP CERTIFICATE
The certificate of a VASP registered in the Travel Rule system can be obtained through this service. The
originating VASP sends a request using beneficary vaspDID to retrieve the certificate data of the beneficiary
VASP.
URL: https://ktdm-test.kamusm.gov.tr/api/v1/ktdm/tr/vasp-cert
Http Method:@GET
JWT token must be included when sending the request. A response can be obtained by sending a GET
request to the URL without including any request body.
The vaspDID must be included as a Request Parameter when sending the request.
6.1 (Request/Input)
https://ktdm-test.kamusm.gov.tr/api/v1/ktdm/tr/vasp-cert?vaspDID=ExampleVaspDID
6.2 (Response/Output)
{
"message": {
"message": "Certificate successfully retrieved.",
"type": "SUCCESS"
},
"messages": null,
"certInfo": {
"base64Certificate": "ExampleBase64EncodedCertificate",
"vaspDID": "ExampleVaspDID"
}
}
TASNİF DIŞI
28/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
OUT OF CLASSIFICATION
TrTRAVEL RULE KTDM SERVISLERI
TRAVEL RULE KTDM SERVISLERI
7 QUERYING TRAVEL RULE REQUEST STATUS INFORMATION
By providing the travel rule id information for a successfully created travel rule request, this service that
retrieves the current status and transaction history of the process related to this id can be used.
URL: https://ktdm-test.kamusm.gov.tr/api/v1/ktdm/tr/status
Http Method:@GET
It is necessary to included JWT token when sending request. A response can be obtained by sending a GET
request to the URL without any request body
TravelRuleId must be included as a Request Param when sending the request.
7.1 (Request/Input)
https://ktdm-test.kamusm.gov.tr/api/v1/ktdm/tr/status?travelRuleId=abe64aba-007f-4dbd-b187-
f4ac9c90ba16
TASNİF DIŞI
29/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
OUT OF CLASSIFICATION
TrTRAVEL RULE KTDM SERVISLERI
TRAVEL RULE KTDM SERVISLERI
7.2 Response/Output
{
"message": null,
"messages": null,
"currentStatus": {
"status": "ACCEPTED",
"statusDetail": "UPDATE_FORWARD_FAILURE",
"date": "2025-07-23T05:30:52.907+00:00"
},
"history": [
{
"status": "ACCEPTED",
"statusDetail": "UPDATE_FORWARD_FAILURE",
"date": "2025-07-23T05:15:22.865+00:00"
},
{
"status": "ACCEPTED",
"statusDetail": "UPDATE_QUEUED_FOR_FORWARDING",
"date": "2025-07-23T04:58:33.985+00:00"
},
{
"status": "ACCEPTED",
"statusDetail": "UPDATE_RECEIVED",
"date": "2025-07-23T04:58:33.962+00:00"
},
{
"status": "ACCEPTED",
"statusDetail": "ACCEPT_QUEUED_FOR_FORWARDING",
"date": "2025-07-23T04:58:33.918+00:00"
},
{
"status": "ACCEPTED",
"statusDetail": "ACCEPT_RECEIVED",
"date": "2025-07-23T04:58:33.901+00:00"
},
{
"status": "ACKNOWLEDGED",
"statusDetail": "CONFIRM_QUEUED_FOR_FORWARDING",
"date": "2025-07-23T04:58:31.926+00:00"
},
{
"status": "ACKNOWLEDGED",
"statusDetail": "CONFIRM_RECEIVED",
"date": "2025-07-23T04:58:31.906+00:00"
},
{
"status": "NEW",
"statusDetail": "CREATE_QUEUED_FOR_FORWARDING",
"date": "2025-07-23T04:58:22.707+00:00"
},
{
"status": "NEW",
"statusDetail": "CREATE_SAVED_IN_DB",
"date": "2025-07-23T04:58:22.679+00:00"
}
TASNİF DIŞI
30/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
OUT OF CLASSIFICATION
TrTRAVEL RULE KTDM SERVISLERI
TRAVEL RULE KTDM SERVISLERI
8 TRAVEL RULE CREDIT INQUIRY SERVICE
It is used to inquire about the remaining credit amount for creating the Travel Rule by registered VASP.
URL: https://ktdm-test.kamusm.gov.tr/api/v1/ktdm/tr/quota/remaining
Http Method:@GET
A JWT token must be included when submitting the request. A response can be obtained by sending a GET
request to the URL without including any request body.
8.1 Response/Output
9 TRAVEL RULE TRAVEL RULE BLOCKCHAIN NETWORK LISTING SERVICE
To ensure uniformity in the transactionAssetNetwork information in the request sent to create the Travel
Rule, a blockchain network listing service has been developed to enable interoperability among blockchain
network listing services.
Http Method:@GET
URL: https://ktdm-test.kamusm.gov.tr/api/public/blockchain-info/network-list
9.1 Response/Output
{
"message": {
"message": "2 adet tanımlı Blockchain Network bulunmaktadır.",
"type": "INFO"
},
"messages": null,
"blockchainNetworkInfoList": [
{
"networkSymbol": "ACA",
"networkName": "Acala"
},
{
"networkSymbol": "ADA",
"networkName": "Cardano"
}
]
}
TASNİF DIŞI
31/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
OUT OF CLASSIFICATION
TrTRAVEL RULE KTDM SERVISLERI
TRAVEL RULE KTDM SERVISLERI
10 TRAVEL RULE CANCEL SERVICE
It enables the originating KVHS to terminate a Travel Rule transaction by updating its status to “Cancelled,”
provided that the process has not yet been completed and the corresponding blockchain transaction has not
yet been initiated.
Http Method: @POST
URL: https://ktdm.kamusm.gov.tr/api/v1/ktdm/tr/cancel
10.1 Http Request Example
{
"id": "13c19bf2-07b6-4e7b-ad8f-d61ae64b9c8a",
"reason": " internal manual test"
}
10.2 Response/Output
{
"message": {
"code": "00",
"message": "Successfully cancelled.",
"type": "SUCCESS"
},
"messages": null,
"status": "NEW",
"transactionType": "TRAVELRULE",
"lifecycleStatus": "CANCELLED",
"id": "faf28bd7-aeff-4897-a7e4-b3c53defc81b"
}

TASNİF DIŞI
32/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
OUT OF CLASSIFICATION
TrTRAVEL RULE KTDM SERVISLERI
TRAVEL RULE KTDM SERVISLERI
11 SERVICE OUTPUT MESSAGES
MESSAGE CODE DESCRIPTION RELATED SERVICE
400 Bad request/ Invalid Request General
403
Forbidden: Access code is
empty/invalid/unsuccessful. General
500 Internal Server Error General
503 Service Unavailable General
00 Successful General
9900 Travel Rule creation failedTravelRuleSaveExcepiton
Create
9910
Travel Rule not foundTravelRuleNotFoundExcepiton
Confirm/Accept/Reject/Decline
and Update
9912
Invalid update requestTravelRuleCanNotBeUpdatedException
Confirm/Accept/Reject/Decline
ve Update
9913
Vasp Not FoundVaspNotFoundException
Create
9914
Vasp Endpoint Not FoundVaspEndpointNotFoundException
Create
9915
Vasp Role Access DeniedVaspRoleAccessDeniedException
Create
TASNİF DIŞI
33/33 24.02.2026 TÜBİTAK BİLGEM – PUBLIC CERTIFICATION AUTHORITY
Warning: Electronic copies accessed from Public CA file server are current and controlled; other prints are uncontrolled copies.
OUT OF CLASSIFICATION
TrTRAVEL RULE KTDM SERVISLERI
TRAVEL RULE KTDM SERVISLERI
12 ADDS
12.1 NATIONALIDENTIFIER TYPES ABBREVIATIONS
ARNU
Foreign registration number (number assigned to
foreigners by the government)
CCPT Passport number
RAID
Business registration number (for legal entities
only)
DRLC Driver's license number
FIIN Foreign investor number
TXID Tax identification number
SOCS Social security number
IDCD Government-issued ID card number
LEIX
Global legal entity identifier (LEI code) assigned
according to ISO 17442 standard (for legal entities
only)
MISC Other national identity number
12.2 ADDRESSTYPE ABBREVIATIONS
HOME Home/Residential Address
BIZZ Business Address
GEOG Geographic Address
