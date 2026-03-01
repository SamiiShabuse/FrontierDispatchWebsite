"FrontierDispatch Smalltalk data pipeline orchestration"

Object subclass: #FDDataPipeline
    instanceVariableNames: ''
    classVariableNames: ''
    package: 'FrontierDispatch-Generators'.

FDDataPipeline >> exportAllToWebDataPath: basePathString
    | contractsPath risksPath scenariosPath |
    contractsPath := basePathString, '/contracts.json'.
    risksPath := basePathString, '/risks.json'.
    scenariosPath := basePathString, '/scenarios.json'.

    FDContractGenerator new exportContractsJsonTo: contractsPath.
    FDEventModel new exportRisksJsonTo: risksPath.
    FDScenarioGenerator new exportScenariosJsonTo: scenariosPath.

FDDataPipeline >> validationReport
    | contracts risks scenarios duplicateIds |
    contracts := FDContractGenerator new contracts.
    risks := FDEventModel new risks.
    scenarios := FDScenarioGenerator new scenarios.
    duplicateIds := self duplicateContractIdsIn: contracts.

    ^ Dictionary new
        at: 'contractsCount' put: contracts size;
        at: 'townCount' put: ((risks at: 'towns') size);
        at: 'scenarioCount' put: scenarios size;
        at: 'duplicateContractIds' put: duplicateIds;
        at: 'hasDuplicateContractIds' put: duplicateIds notEmpty;
        at: 'generatedAt' put: DateAndTime now asString;
        yourself.

FDDataPipeline >> duplicateContractIdsIn: contracts
    | seen duplicates |
    seen := Set new.
    duplicates := OrderedCollection new.
    contracts do: [ :contract |
        | id |
        id := contract at: 'id' ifAbsent: [ '' ].
        (seen includes: id)
            ifTrue: [ duplicates add: id ]
            ifFalse: [ seen add: id ] ].
    ^ duplicates asArray.

FDDataPipeline >> exportValidationReportJsonTo: aPathString
    | stream json |
    json := NeoJSONWriter toString: self validationReport.
    stream := FileStream forceNewFileNamed: aPathString.
    [ stream nextPutAll: json ] ensure: [ stream close ].
