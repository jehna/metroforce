# metroforce.js
> JS library to generate subway maps with automatic force graph solving

This library generates automatic subway map -styled graphs that are solved to
local minimum force by [force-directed graph drawing][forcegraph]

## Example output
Here's an example output of the function:
<img src="https://raw.githubusercontent.com/jehna/metroforce/master/examples/example.png" alt="" />

## Usage
You can use the library by:
```javascript
metroforce(stationNames, roads[, options]);
```

### Example usage
```javascript
new metroforce(
    [
        'Viisikulma',
        'R-kioski',
        'Len\'s keishoku',
        'Sis Deli',
        'Pursari-Albertinkatu kulma',
        'Suomi kahvila',
        'Hoku',
        'Kinki',
        'Puisto',
        'Wanha ct HQ',
        
        'Brooklyn cafe',
        'Vivo\'s',
        'We got beef',
        'Fafa\'s',
        'Beefy queen'
    ],
    {
        'Pursimiehenkatu': [[0,1,2,3,4,5]],
        'Albertinkatu': [[4,6]],
        'Frederikinkatu': [[1,10,11]],
        'Iso-Roobertinkatu': [[11,12,13]],
        'Other': [[5,7,8,9,0],[13,14]]
    }
);
```

## Options
| Name      | Default value | Description                  |
|-----------|---------------|------------------------------|
| width     |           700 | Width of the generated svg   |
| height    |           800 | Height of the generated svg  |
| labelsPos |           200 | Position of the labels group |

## Contributions
Contributions are warmly welcome via pull requests

## License
The work is licensed under MIT license

[forcegraph]: http://en.wikipedia.org/wiki/Force-directed_graph_drawing