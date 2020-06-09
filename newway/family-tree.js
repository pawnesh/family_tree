import { Drawer } from './draw.js';

export class FamilyTree {
    constructor(tree) {
        this.tree = tree;
        this.rootNodes = [];
        this.findRootNodes();
        this.tracTree();
    }

    findRootNodes() {
        this.tree.forEach((element, index) => {
            if (element.parent.length == 0) {
                if (!this.isSpouseHasParent(element)) {
                    this.rootNodes.push(index);
                }
            }
        });
        // console.log(this.rootNodes);
    }

    isSpouseHasParent(element) {
        if (element.spouse.length == 0) {
            return false;
        }
        // if have multiple spouse
        for (var i = 0; i < element.spouse.length; i++) {
            var spouseIndex = element.spouse[i];
            if (this.tree[spouseIndex].parent.length > 0) {
                return true;
            }
        }

        return false;
    }

    tracTree() {
        this.rootNodes.forEach((elementIndex, index) => {
            this.traceNode(elementIndex, 0 + index, 0);
        });
    }

    traceNode(index, x, y) {
        if (this.tree[index].hasOwnProperty('x')) {
            return;
        }
        this.tree[index]['x'] = x;
        this.tree[index]['y'] = y;

        if (this.tree[index].spouse.length > 0) {
            this.tree[index].spouse.forEach((spouseIndex, index) => {
                this.traceNode(spouseIndex, x + index + 1, y);
            });
        }


        if (this.tree[index].children.length > 0) {
            var previousChildSpouseCount = 0;
            var previousChildChildCount = 0;
            var parentSiblingChildCount = this.getPreviousSiblingChildCount(index);

            this.tree[index].children.forEach((childTreeIndex, index) => {
                var childX = index + previousChildSpouseCount + parentSiblingChildCount;

                this.tree[childTreeIndex]['previousSiblingChildCount'] = previousChildChildCount;
                this.traceNode(childTreeIndex, childX, y + 1);
                previousChildSpouseCount = this.tree[childTreeIndex].spouse.length;
                previousChildChildCount = this.getChildCount(childTreeIndex);
            });
        }
    }

    getPreviousSiblingChildCount(index) {
        if (this.tree[index].previousSiblingChildCount) {
            return this.tree[index].previousSiblingChildCount;
        }

        if (this.tree[index].spouse.length > 0) {
            for (var i = 0; i < this.tree[index].spouse.length; i++) {
                var spouseIndex = this.tree[index].spouse[i];
                if (this.tree[spouseIndex].previousSiblingChildCount) {
                    return this.tree[spouseIndex].previousSiblingChildCount;
                }
            }
        }
        return 0;
    }

    getChildCount(index) {
        if (this.tree[index].children.length > 0) {
            return this.tree[index].children.length
        }
        if (this.tree[index].spouse.length > 0) {
            var total = 0;
            this.tree[index].spouse.forEach(spouseIndex => {
                total = total + this.tree[spouseIndex].children.length;
            });
            return total;
        }
        return 0;
    }

    printTree() {
        console.log(this.tree);
    }

    render(canvas) {
        let $drawer = new Drawer(this.tree, this.rootNodes, canvas);
        $drawer.draw();
    }
}