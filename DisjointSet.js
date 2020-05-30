class DisjointSet {

	constructor(numberOfItems = 0) {

    //Array of items. Each item has an index which points to the parent set.
		this.sets = [];

		//record the size of the sets so we know which one should win (only at the parent index)
		this.setSizes = [];

    for(let i = 0; i < numberOfItems; i++){
			this.sets[i] = i;
			this.setSizes[i] = 1;
    }
	}

	findParent(index) {
		let parentIndex = this.sets[index];

		//if the parent is itself, then it has no parent so it must be the parent of the set
		if (parentIndex === index) {
			return index;
		}

		//recusively find parent until it has no parent (parent is self)
		let rootParentIndex = this.findParent(parentIndex);

		//save it for later so we don't have to go searching that far up the tree again
		this.sets[index] = rootParentIndex;
		return rootParentIndex;
	}

	//join 2 sets together
	union(index1, index2) { 
		let parent1 = this.findParent(index1);
		let parent2 = this.findParent(index2);

		//the bigger set should always win, so that we can avoid flickering when visualising the sets
		if (this.setSizes[parent1] >= this.setSizes[parent2]) {
			this.sets[parent2] = parent1;
			this.setSizes[parent1] += this.setSizes[parent2];
		} else {
			this.sets[parent1] = parent2;
			this.setSizes[parent2] += this.setSizes[parent1];
		}

	}
}

export default DisjointSet;