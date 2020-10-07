const express = require("express"),
    app = express(),
    router = express.Router(),
    layouts = require("express-ejs-layouts");

const fs = require("fs");

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use("/", router);

router.use(express.static("public"));
router.use(layouts);
router.use(
    express.urlencoded({
        extended: false
    })
);
router.use(express.json());

function readFile(file_path) {
    let file = fs.readFileSync(file_path)
    let data = JSON.parse(file)
    // return data.products
    return data
}

console.log(readFile("data.json"))

function writeFile(file_path, item) {
    // let {products} = readFile(file_path)
    let products = readFile(file_path)
    products.products.push(item)
    products = JSON.stringify(products)

    console.log(products)

    fs.writeFile(file_path, products, function(error) {
        if (error) {
            console.log(error)
        }
    })

    //return JSON.stringify(products)
}

router.get("/", function(req, res) {
    const products = readFile("data.json")
    // res.render("products", products) // this works, too! :)

    res.locals.products = products
    res.render("products")

})

router.get("/form", function(req, res) {
    res.render("form")
})

router.post("/save-form", function(req, res, next) {
    console.log(req.body.name)

    const properties = {
        name: req.body.name
    }

    writeFile("data.json", properties)

    //console.log(writeFile("data.json", properties))

    next()
})

readFile("data.json")

app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
});
