var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "houston75",
    database: "bamazonDB"

});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id" + connection.threadId);
    afterconnection()
});

function afterconnection() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(res);

        start();
    });

    function start() {
        inquirer.prompt([

            	{
                    name: "productID"
                    type: "input"
                    message: "What is the Id of the product that you would like to buy?"
                    validate: function(value){
                    	if (!isNaN(value)){
                    		return true;
                    	}
                    	return false;
                    }
                }, 
                {
                    name: "quantity"
                    type: "input"
                    message: "How many units of that product would you like to buy?"
                    validate: function(value){
                    	if (!isNAN(value)){
                    		return true;
                    	}
                    	return false;
                    }

                }

            ])

    .then(function(answer){

    	var itemId = answer.productID;
    	console.log("Chosen item id: ", itemId);

    	var itemQuantity = answer.quantity;
    	console.log("Chose quantity from stock:", itemQuantity);

    	connection.query("SELECT * FROM products WHERE ?", [{ id : itemId }], function(err, res){
    		if(err) throw err;

    		console.table(res);

    		var actual_qty = res[0].stock_quantity;
    		var price = res[0].price;
    		var remaining_qty = actual_qty - answer.quantity;
    		console.log("Remaining qty in stock: ", remaining_qty);

    		if(actual_qty>answer.quantity){
    			console.log("Amount remaining:", remaining_qty);
    			console.log("total cost: "(answer.quantity * price));

    			connection.query("UPDATE products SET stock_quantity=? WHERE id=?")
    			[
    			remaining_qty, answer.productID
    			],
    		}
    	})






