"FrontierDispatch Scenario Generator"

Object subclass: #FDScenarioGenerator
    instanceVariableNames: ''
    classVariableNames: ''
    package: 'FrontierDispatch-Generators'.

FDScenarioGenerator >> scenarios
    ^ {
        Dictionary new
            at: 'id' put: 'S-001';
            at: 'name' put: 'Desert Night Relay';
            at: 'weather' put: 'sandwind';
            at: 'enemyPressure' put: 0.62;
            at: 'recommendedRoute' put: 'balanced';
            at: 'payoutMultiplier' put: 1.08;
            yourself.
        Dictionary new
            at: 'id' put: 'S-002';
            at: 'name' put: 'Mountain Whiteout Escort';
            at: 'weather' put: 'snow';
            at: 'enemyPressure' put: 0.71;
            at: 'recommendedRoute' put: 'long-safe';
            at: 'payoutMultiplier' put: 1.18;
            yourself.
        Dictionary new
            at: 'id' put: 'S-003';
            at: 'name' put: 'Rail Junction Hot Zone';
            at: 'weather' put: 'clear';
            at: 'enemyPressure' put: 0.83;
            at: 'recommendedRoute' put: 'short-risky';
            at: 'payoutMultiplier' put: 1.27;
            yourself
    }.

FDScenarioGenerator >> exportScenariosJsonTo: aPathString
    | stream json |
    json := NeoJSONWriter toString: self scenarios.
    stream := FileStream forceNewFileNamed: aPathString.
    [ stream nextPutAll: json ] ensure: [ stream close ].
