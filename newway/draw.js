export class Drawer {
    constructor(tree, rootNodes, canvas) {
        this.tree = tree;
        this.canvas = canvas;
        this.rootNodes = rootNodes;
        this.rowHeight = 100;
        this.boxHeight = 130;
        this.boxWidth = 80;
        this.boxPadding = 10;
        this.boxMargin = 10;
        this.boxWithPadding = this.boxWidth + this.boxPadding * 2 + this.boxMargin * 2;

        this.defaultMaleImage = 'family-tree/img/male.png';
        this.defaultFemaleImage = 'family-tree/img/female.png';
        this.calculateMaxBoxInRow();
    }

    refresh(){
        this.calculateMaxBoxInRow();
        this.draw();
    }

    setOnClick(editDetails,addMember,deleteMember){
        this.editDetails = editDetails;
        this.addMember = addMember;
        this.deleteMember = deleteMember;
    }

    calculateMaxBoxInRow() {
        var index = 0;
        this.tree.forEach(node => {
            if (node.x > index) {
                index = node.x;
            }
        });
        this.widestRow = index;
    }

    draw() {
        this.rootNodes.forEach(index => {
            this.tree[index]['extraSpace'] = (this.boxWithPadding * this.widestRow) - (this.boxWithPadding * this.rootNodes.length) / 2;
            if(this.tree[index].extraSpace < 0){
                this.tree[index].extraSpace = this.tree[index].extraSpace*-1;
            }
            this.drawNode(index, 0, 0);
        });

        console.log(this.tree);
    }

    drawNode(index, spouseSpace, spaceRelativeToParent) {
        let node = this.tree[index];
        if (this.tree[index].xCordinate) {
            return;
        }

        if (spaceRelativeToParent > 0) {
            spaceRelativeToParent = spaceRelativeToParent - this.boxWithPadding / 2;
        }

        let canvasX = this.canvas.getBoundingClientRect().left;
        let canvasY = this.canvas.getBoundingClientRect().top;

        let xCordinate = this.boxWithPadding * node.x + spaceRelativeToParent + canvasX + spouseSpace;
        let yCordinate = this.boxWithPadding * node.y + this.rowHeight * node.y + canvasY;
        if (node.extraSpace) {
            xCordinate = xCordinate + node.extraSpace;
        }
        this.tree[index]['xCordinate'] = xCordinate;
        this.tree[index]['yCordinate'] = yCordinate;
        this.drawBox(xCordinate, yCordinate, node,index);

        this.tree[index].spouse.forEach(spouseIndex => {
            this.drawNode(spouseIndex, spaceRelativeToParent, 0);
        });

        this.tree[index].children.forEach(childIndex => {
            this.drawNode(childIndex, 0, xCordinate);
        });
    }

    drawBox(xCordinate, yCordinate, node,index) {
        let divNode = document.createElement('a');
        divNode.id = 'family-node-'+index;
        divNode.href = 'javascript:void(0);';
        divNode.className = 'family-node';
        let li = '<li><strong>Name:</strong> ' + node.name + '</li>';
        li += '<li><strong>Age:</strong> ' + node.age + '</li>';
        divNode.innerHTML = '<div class="name">' + node.name + '</div>';
        divNode.innerHTML = divNode.innerHTML + '<div class="info"><ul>' + li + '</ul></div>';

        if (!node.image && node.gender == 'f') {
            divNode.innerHTML = '<img src="' + this.defaultFemaleImage + '"/>' + divNode.innerHTML;
        }
        if (!node.image && node.gender == 'm') {
            divNode.innerHTML = '<img src="' + this.defaultMaleImage + '"/>' + divNode.innerHTML;
        }
        divNode.style.left = xCordinate;
        divNode.style.top = yCordinate;
        divNode.style.width = this.boxWidth;
        divNode.style.padding = this.boxPadding;
        divNode.style.marggin = this.boxMargin;
        this.canvas.append(divNode);

        let width = this.boxWithPadding;
        divNode.onmouseover = function (event) {
            divNode.querySelector('.info').style.left = width;
        };

        this.drawRelation(xCordinate, yCordinate, node,index);

    }

    drawRelation(xCordinate, yCordinate, node,index) {
        node.parent.forEach(parentIndex => {
            let parent = this.tree[parentIndex];
            var div = document.createElement('div');
            div.className = 'family-tree-row';
            let width = parent.xCordinate - xCordinate;
            div.style.top = yCordinate - 15;

            if(width >= 0){
                div.className += ' family-tree-row-left';
                div.style.width = width;
                div.style.left = xCordinate + this.boxWithPadding/2;
            }else{
                div.className += ' family-tree-row-right';
                div.style.width = width*(-1);
                div.style.left = parent.xCordinate + this.boxWithPadding/2;
            }
            this.canvas.append(div);

            if(document.querySelector('#family-parent-connect-'+parentIndex) != null){
                return;
            }

            let divConnect = document.createElement('div');
            divConnect.className = 'family-tree-col';
            divConnect.id = 'family-parent-connect-'+parentIndex;
            let height = yCordinate - (parent.yCordinate + this.boxHeight + 14);
            divConnect.style.height = height;
            divConnect.style.left = parent.xCordinate + this.boxWithPadding/2;
            divConnect.style.top = parent.yCordinate + this.boxHeight - 1;
            this.canvas.append(divConnect);
            
        });

        node.spouse.forEach(spouseIndex => {
            let spouse = this.tree[spouseIndex];
            
            if(!spouse.xCordinate){
                return;
            }
            if(document.querySelector('#family-tree-row-'+spouseIndex) != null){
                return;
            }
            if(document.querySelector('#family-tree-row-'+index) != null){
                return;
            }
            var div = document.createElement('div');
            div.id = 'family-tree-row-'+spouseIndex;
            div.className = 'family-tree-row family-tree-plain-row';
            div.style.top = yCordinate + this.boxHeight/2;
            if(spouse.xCordinate > node.xCordinate){
                div.style.left = node.xCordinate + this.boxWidth + 21;
                div.style.width = spouse.xCordinate - this.boxWidth - node.xCordinate - 20;
            }else{
                div.style.left = spouse.xCordinate + this.boxWidth + 21;
                div.style.width = node.xCordinate - this.boxWidth - spouse.xCordinate - 20;
            }

            this.canvas.append(div);
        });
    }

}