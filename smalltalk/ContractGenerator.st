"FrontierDispatch Contract Generator"

Object subclass: #FDContractGenerator
    instanceVariableNames: ''
    classVariableNames: ''
    package: 'FrontierDispatch-Generators'.

FDContractGenerator >> contracts
    ^ {
        Dictionary new
            at: 'id' put: 'C-001';
            at: 'title' put: 'Tombstone Relief Convoy';
            at: 'towns' put: #('Tombstone');
            at: 'resources' put: #('Water' 'Food');
            at: 'payout' put: 280;
            yourself.
        Dictionary new
            at: 'id' put: 'C-002';
            at: 'title' put: 'Deadwood Clinic Resupply';
            at: 'towns' put: #('Deadwood');
            at: 'resources' put: #('Food' 'Medicine' 'Tools');
            at: 'payout' put: 420;
            yourself.
        Dictionary new
            at: 'id' put: 'C-003';
            at: 'title' put: 'Dodge City Bullion Security Run';
            at: 'towns' put: #('Dodge City');
            at: 'resources' put: #('Gold');
            at: 'payout' put: 510;
            yourself
    }.

FDContractGenerator >> exportContractsJsonTo: aPathString
    | stream json |
    json := NeoJSONWriter toString: self contracts.
    stream := FileStream forceNewFileNamed: aPathString.
    [ stream nextPutAll: json ] ensure: [ stream close ].
