"FrontierDispatch Event Risk Model"

Object subclass: #FDEventModel
    instanceVariableNames: ''
    classVariableNames: ''
    package: 'FrontierDispatch-Generators'.

FDEventModel >> risks
    ^ Dictionary new
        at: 'generatedBy' put: 'Smalltalk EventModel';
        at: 'towns' put: {
            Dictionary new
                at: 'name' put: 'Tombstone';
                at: 'biome' put: 'desert';
                at: 'needs' put: #('Water' 'Food');
                at: 'stability' put: 62;
                at: 'routeRisk' put: (Dictionary new
                    at: 'short-risky' put: 0.74;
                    at: 'balanced' put: 0.53;
                    at: 'long-safe' put: 0.31;
                    yourself);
                yourself.
            Dictionary new
                at: 'name' put: 'Deadwood';
                at: 'biome' put: 'mountain';
                at: 'needs' put: #('Food' 'Medicine' 'Tools');
                at: 'stability' put: 55;
                at: 'routeRisk' put: (Dictionary new
                    at: 'short-risky' put: 0.77;
                    at: 'balanced' put: 0.56;
                    at: 'long-safe' put: 0.36;
                    yourself);
                yourself.
            Dictionary new
                at: 'name' put: 'Dodge City';
                at: 'biome' put: 'main';
                at: 'needs' put: #('Gold');
                at: 'stability' put: 71;
                at: 'routeRisk' put: (Dictionary new
                    at: 'short-risky' put: 0.58;
                    at: 'balanced' put: 0.35;
                    at: 'long-safe' put: 0.21;
                    yourself);
                yourself
        };
        at: 'events' put: #('Dust storm' 'Broken bridge' 'Bandits');
        yourself.

FDEventModel >> exportRisksJsonTo: aPathString
    | stream json |
    json := NeoJSONWriter toString: self risks.
    stream := FileStream forceNewFileNamed: aPathString.
    [ stream nextPutAll: json ] ensure: [ stream close ].
