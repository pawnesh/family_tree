import {FamilyTree} from './family-tree.js';

var family = [
    {
        "name": "grand father",
        "age": 89,
        "gender": "m",
        "image": null,
        "children": [],
        "parent": [],
        "spouse": [1]
    },
    {
        "name": "grand mother",
        "age": 60,
        "gender": "f",
        "image": null,
        "children": [2,3],
        "parent": [],
        "spouse": [0]
    },
    {
        "name": "son one",
        "age": 56,
        "gender": "m",
        "image": null,
        "children": [],
        "parent": [1],
        "spouse": [4]
    },
    {
        "name": "son two",
        "age": 50,
        "gender": "m",
        "image": null,
        "children": [],
        "parent": [1],
        "spouse": [5]
    },
    {
        "name": "Wife One",
        "age": 45,
        "gender": "f",
        "image": null,
        "children": [6,7],
        "parent": [],
        "spouse": [2]
    },
    {
        "name": "Wife two",
        "age": 45,
        "gender": "f",
        "image": null,
        "children": [8],
        "parent": [],
        "spouse": [3]
    },
    {
        "name": "Daughter one",
        "age": 15,
        "gender": "f",
        "image": null,
        "children": [],
        "parent": [4],
        "spouse": []
    },
    {
        "name": "Daughter two",
        "age": 25,
        "gender": "f",
        "image": null,
        "children": [],
        "parent": [4],
        "spouse": []
    },
    {
        "name": "Son one",
        "age": 25,
        "gender": "m",
        "image": null,
        "children": [],
        "parent": [5],
        "spouse": []
    }
];

var drawer = new FamilyTree(family);
drawer.render(document.getElementById('draw'));
