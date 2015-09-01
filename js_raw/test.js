


class Foo {

	//let g = 69;

	constructor(){

		this.c = 69;
		Foo.count ++;

		//this.g = const 
		console.log(Foo.count);
	}

}

Foo.count=0;

class Employee
{
  constructor(){
    this.name = "Ravi";
  }
  setName(name){
    this.name = name;
  }
 
  static getCounter(){
    if(!this.counter && this.counter!==0){
      this.counter=0;
    }
    else{
      this.counter++;
    }
    return this.counter;
  }
}