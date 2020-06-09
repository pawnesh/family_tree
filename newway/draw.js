export class Drawer {
    constructor(tree, rootNodes, canvas) {
        this.tree = tree;
        this.canvas = canvas;
        this.rootNodes = rootNodes;
        this.rowHeight = 100;
        this.boxHeight = 160;
        this.boxWidth = 80;
        this.boxPadding = 10;
        this.boxMargin = 10;
        this.boxWithPadding = this.boxWidth + this.boxPadding * 2 + this.boxMargin * 2;

        this.defaultMaleImage = 'family-tree/img/male.png';
        this.defaultFemaleImage = 'family-tree/img/female.png';
        this.calculateMaxBoxInRow();
    }

    calculateMaxBoxInRow() {
        var index = -1;
        this.tree.forEach(node => {
            if (node.x > index) {
                index = node.x;
            }
        });
        this.widestRow = index;
    }

    draw() {
        console.log(this.tree);
        this.rootNodes.forEach(index => {
            this.tree[index]['extraSpace'] = (this.boxWithPadding * this.widestRow) - (this.boxWithPadding * this.rootNodes.length) / 2;
            this.drawNode(index,-1);
        });
    }

    drawNode(index) {
        let node = this.tree[index];
        let spaceRelativeToParent = 0;
        if(this.tree[index].xCordinate){
            return;
        }

        if(this.tree[index].parent.length && this.tree[index].parent[0].xCordinate){
            spaceRelativeToParent = this.tree[index].parent[0].xCordinate;
        }
        let canvasX = this.canvas.getBoundingClientRect().left;
        let canvasY = this.canvas.getBoundingClientRect().top;

        let xCordinate = this.boxWithPadding * node.x + spaceRelativeToParent + canvasX;
        let yCordinate = this.boxWithPadding * node.y + this.rowHeight * node.y + canvasY;
        console.log(this.boxWithPadding + ' ' + node.x);
        if (node.extraSpace) {
            xCordinate = xCordinate + node.extraSpace;
        }
        this.tree[index]['xCordinate'] = xCordinate;
        this.tree[index]['yCordinate'] = yCordinate;
        this.drawBox(xCordinate, yCordinate, node);
        
        this.tree[index].spouse.forEach(spouseIndex => {
            this.drawNode(spouseIndex,index);
        });

        this.tree[index].children.forEach(childIndex => {
            this.drawNode(childIndex,index);
        });
    }

    drawBox(xCordinate, yCordinate, node) {
        let divNode = document.createElement('a');
        divNode.href = 'javascript:void(0);';
        divNode.className = 'family-node';
        let li = '<li><strong>Name:</strong> '+node.name+'</li>';
        li += '<li><strong>Age:</strong> '+node.age+'</li>';
        divNode.innerHTML = '<div class="name">' + node.name + '</div>';
        divNode.innerHTML = divNode.innerHTML+ '<div class="info"><ul>'+li+'</ul></div>';
        
        if(!node.image && node.gender == 'f'){
            divNode.innerHTML = '<img src="'+this.defaultFemaleImage+'"/>' + divNode.innerHTML;
        }
        if(!node.image && node.gender == 'm'){
            divNode.innerHTML = '<img src="'+this.defaultMaleImage+'"/>' + divNode.innerHTML;
        }
        divNode.style.left = xCordinate;
        divNode.style.top = yCordinate;
        divNode.style.width = this.boxWidth;
        divNode.style.padding = this.boxPadding;
        divNode.style.marggin = this.boxMargin;
        console.log(xCordinate + ' ' + yCordinate);
        this.canvas.append(divNode);
    }
}