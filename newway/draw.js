export class Drawer {
    constructor(tree, rootNodes, canvas) {
        this.tree = tree;
        this.canvas = canvas;
        this.rootNodes = rootNodes;
    }

    draw() {
        console.log(this.tree);
    }
}