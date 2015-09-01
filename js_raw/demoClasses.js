var demoClasses = {

	Blank: function(){
		return new ClassItem(100);
	},
	CompleteDemo: function(){

		var NewItem = new ClassItem(101);
		NewItem.setName('ThoroughDemo');
		NewItem.setAncestor('SomeClass');
		NewItem.addInterface(['Demoable', 'Listable', 'Comparable']);
		NewItem.setPublic(true);
		NewItem.setFinal(false);
		NewItem.setAbstract(false);

		//MEMBERS
		NewItem.addMember(	{
								mName: 'anInt',
								access: PUBLIC,
								isStatic: true,
								isConst: true,
								mType: INT,
								val: null
						   	});
		NewItem.addMember(	{
								mName: 'aShort',
								access: PUBLIC,
								isStatic: true,
								isConst: false,
								mType: SHORT,
								val: 12300
						   	});
		NewItem.addMember(	{
								mName: 'aLong',
								access: PUBLIC,
								isStatic: false,
								isConst: true,
								mType: LONG,
								val: 123000000
						   	});
		NewItem.addMember(	{
								mName: 'aByte',
								access: PUBLIC,
								isStatic: false,
								isConst: false,
								mType: BYTE,
								val: 123
						   	});
		NewItem.addMember(	{
								mName: 'aFloat',
								access: PRIVATE,
								isStatic: false,
								isConst: false,
								mType: FLOAT,
								val: 3.14
						   	});
		NewItem.addMember(	{
								mName: 'aDouble',
								access: PRIVATE,
								isStatic: false,
								isConst: false,
								mType: DOUBLE,
								val: 3.14159
						   	});
		NewItem.addMember(	{
								mName: 'aChar',
								access: PRIVATE,
								isStatic: false,
								isConst: false,
								mType: CHAR,
								val: 'g'
						   	});
		NewItem.addMember(	{
								mName: 'aString',
								access: PRIVATE,
								isStatic: false,
								isConst: false,
								mType: STRING,
								val: "Classetta Rules!"
						   	});
		NewItem.addMember(	{
								mName: 'aBoolean',
								access: PRIVATE,
								isStatic: false,
								isConst: false,
								mType: BOOLEAN,
								val: true
						   	});

		//METHODS
		NewItem.addMethod(	{
								mName: 'main',
								access: PUBLIC,
								isStatic: true,
								isConst: false,
								mType: VOID,
								params: []
						   	});
		NewItem.addMethod(	{
								mName: 'foo',
								access: PRIVATE,
								isStatic: false,
								isConst: true,
								mType: LONG,
								params: []
						   	});
		NewItem.addMethod(	{
								mName: 'compare',
								access: PUBLIC,
								isStatic: false,
								isConst: false,
								mType: BOOLEAN,
								params: []
						   	});
		NewItem.addMethod(	{
								mName: 'list',
								access: PUBLIC,
								isStatic: false,
								isConst: false,
								mType: STRING,
								params: []
						   	});
		NewItem.addMethod(	{
								mName: 'doDemo',
								access: PUBLIC,
								isStatic: false,
								isConst: false,
								mType: VOID,
								params: []
						   	});

		return NewItem;
	},

	RoboKitty: function(){

		var NewItem = new ClassItem(102);
		NewItem.setName('RoboKitty');
		NewItem.setAncestor('Cat');
		NewItem.addInterface(['Petable', 'Chargeable']);
		NewItem.setPublic(true);
		NewItem.setFinal(true);
		NewItem.setAbstract(false);

		//MEMBERS
		NewItem.addMember(	{
								mName: 'livesLeft',
								access: PUBLIC,
								isStatic: false,
								isConst: false,
								mType: INT,
								val: 9
						   	});
		NewItem.addMember(	{
								mName: 'batteryLevel',
								access: PRIVATE,
								isStatic: false,
								isConst: false,
								mType: DOUBLE,
								val: 100.0
						   	});
		NewItem.addMember(	{
								mName: 'MAX_LIVES',
								access: PUBLIC,
								isStatic: false,
								isConst: true,
								mType: INT,
								val: 9
						   	});
		NewItem.addMember(	{
								mName: 'name',
								access: PRIVATE,
								isStatic: false,
								isConst: false,
								mType: STRING,
								val: "DeathClaw"
						   	});
	
		//METHODS
		NewItem.addMethod(	{
								mName: 'getName',
								access: PUBLIC,
								isStatic: false,
								isConst: true,
								mType: STRING,
								params: []
						   	});
		NewItem.addMethod(	{
								mName: 'setName',
								access: PUBLIC,
								isStatic: false,
								isConst: true,
								mType: VOID,
								params: []
						   	});
		NewItem.addMethod(	{
								mName: 'reCharge',
								access: PUBLIC,
								isStatic: false,
								isConst: false,
								mType: BOOLEAN,
								params: []
						   	});
		NewItem.addMethod(	{
								mName: 'pet',
								access: PUBLIC,
								isStatic: false,
								isConst: false,
								mType: VOID,
								params: []
						   	});
		NewItem.addMethod(	{
								mName: 'attack',
								access: PUBLIC,
								isStatic: false,
								isConst: false,
								mType: VOID,
								params: []
						   	});

		NewItem.addMethod(	{
								mName: 'computeTrajectory',
								access: PRIVATE,
								isStatic: true,
								isConst: false,
								mType: DOUBLE,
								params: []
						   	});

		return NewItem;
	},

	OnlyMembers: function(){
		var NewItem = new ClassItem(104);

		NewItem.setName('OnlyMembers');
		
		NewItem.addMember('a');
		NewItem.addMember('b');		
		NewItem.addMember('c');
		
		return NewItem;
	},

	OnlyConstants: function(){
		var NewItem = new ClassItem(105);

		NewItem.setName('OnlyConstants');
		
		NewItem.addMember('a');
		NewItem.getMemberByName('a').isConst=true;

		NewItem.addMember('b');
		NewItem.getMemberByName('b').isConst=true;
		
		NewItem.addMember('c');
		NewItem.getMemberByName('c').isConst=true;
		
		return NewItem;
	},

	OnlyStatics: function(){
		var NewItem = new ClassItem(106);

		NewItem.setName('OnlyStatics');
		
		NewItem.addMember('a');
		NewItem.getMemberByName('a').isStatic=true;

		NewItem.addMember('b');
		NewItem.getMemberByName('b').isStatic=true;
		
		NewItem.addMember('c');
		NewItem.getMemberByName('c').isStatic=true;
		
		return NewItem;
	}
}


