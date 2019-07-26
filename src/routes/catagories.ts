import uuidv1 from 'uuid/v1';
import { Category } from '../models/categories';
import { Product } from '../models/products';
import { Router, Request, Response, NextFunction, json } from 'express';

const categRouter = Router();
const productsRouter = Router();

const fetch = require('node-fetch');

//arrays for use from json
const categories: Category[] = [];
const products: Product[] = [];

//initialize array with uuid
const loadcategories = async () => {
    const catgObject = await fetch('http://localhost:3000/public/productList.json');
    const obj = await catgObject.json();
    obj.Categories.forEach(function (catg: any) {
        catg.id = uuidv1();
        catg.products.forEach(function (prod: any) {
            prod.id = uuidv1();
            prod.catagoryId = catg.id;
            products.push(prod);
        });
        categories.push(catg);
    });
}

loadcategories();


function loadProducts(): Promise<Product[]> {
    return Promise.resolve(products);
}

function loadCategories(): Promise<Category[]> {
    return Promise.resolve(categories);
}



//************************product router ********************/


productsRouter.get('/', async (req, res, next) => {
    const prods = await loadProducts();
    res.send(prods);
});

productsRouter.get('/:id', async (req, res, next) => {
    const prods = await loadProducts();
    let idProduct = req.params.id;
    const matching = products.find(o => o.id === idProduct);
    if (idProduct.length != 36) {
        res.status(404).json({ msg: 'id is bot equal to 36 chars' });
    }
    else if (!matching) {
        res.status(400).json({ msg: 'proudct not found' });
    }
    else {
        prods.forEach((element) => {
            if (element.id == idProduct) {
                res.send(element);
                res.sendStatus(200);
            }
            else {
                res.status(400).json({ msg: 'proudct not found' });
            }
        })
    }
});

productsRouter.post('/', async (req, res, next) => {
    const newProduct: Product = {
        id: uuidv1(),
        categoryId: req.body.categoryId,
        name: req.body.name,
        itemInStock: req.body.itemInStock
    };
    if (!newProduct.name || !newProduct.categoryId || !newProduct.itemInStock) {
        res.status(409).json({ msg: 'please include name, catagoryId, itemInStock' });
    }
    else if (newProduct.name.length < 3) {
        res.status(409).json({ msg: 'name need to be longer then 3 charcters' })
    }
    else {
        products.push(newProduct);
        res.status(201);
        res.json(products);
    }
})


productsRouter.put('/:id', (req, res) => {
    const idproduct = req.params.id;
    if (idproduct.length != 36) {
        res.status(404).json({ msg: 'id is not equal to 36 chars' });
    }
    const found = products.some(product => product.id === req.params.id);
    if (found) {
        const updProduct = req.body;
        if (updProduct.name.length < 3) {
            res.status(409).json({ msg: 'name need to be longer then 3 charcters' })
        }
        products.forEach(product => {
            if (product.id === req.params.id) {
                product.name = updProduct.name ? updProduct.name : product.name;
                product.itemInStock = updProduct.itemInStock ? updProduct.itemInStock : product.name;
                res.status(201).json({ msg: 'product updated' });
            }
        })
    }
    else {
        res.status(400).json({ msg: 'error in update item' })
    }
},
);


productsRouter.delete('/:id', async (req, res, next) => {
    const idproduct = req.params.id;
    if (idproduct.length != 36) { res.status(404).json({ msg: 'id is bot equal to 36 chars' }) };
    const found = products.some(product => product.id === req.params.id);
    if (found) {
        res.status(204).json({
         msg: 'Product deleted',
         products: products.filter(product => product.id !== req.body.id)
     })}
    else {
        res.status(400).json({ msg: `no product with the id of ${req.body.id}` });
    }
});


//************************ category router ********************/

categRouter.get('/', async (req, res, next) => {
    const categ = await loadCategories();
    res.send(categ);
});

categRouter.get('/:id/product', async (req, res, next) => {
    const cats = await loadCategories();
    let IdCategory = req.params.id;
    if (IdCategory.length != 36) {
        res.status(404).json({ msg: 'id is not equal to 36 chars' });
    }

    const matching = categories.find(o => o.id === IdCategory);
    if (!matching) {
        res.sendStatus(404);
    }
    else {
        cats.forEach((element) => {
            if (element.id == IdCategory) {
                res.send(element.products);
                res.sendStatus(200);
            }
            else {
                res.sendStatus(400);
            }
        })
    }
});


categRouter.get('/:id', async (req, res, next) => {
    const cats = await loadCategories();
    let IdCategory = req.params.id;
    if (IdCategory.length != 36) {
        res.status(404).json({ msg: 'id is not equal to 36 chars' });
    }
    const matching = categories.find(o => o.id === IdCategory);
    if (!matching) {
        res.sendStatus(404);
    }
    else {
        cats.forEach((element) => {
            if (element.id == IdCategory) {
                res.send("Category name: " + element.name);
                res.sendStatus(200);
            }
            else {
                res.sendStatus(400);
            }
        })
    }
});


categRouter.post('/', async (req, res, next) => {
    const productsToNewCat: Product[] = [];
    const newCategory: Category = {
        id: uuidv1(),
        name: req.body.name,
        products: productsToNewCat
    };
    if (!newCategory.name) {
        return res.status(409).json({ msg: 'please include name' });
    }
    else {
        categories.push(newCategory);
        res.json(categories);
        res.status(201);
    }
})



categRouter.put('/:id', (req, res) => {
    let IdCategory = req.params.id;
    if (IdCategory.length != 36) {
        res.status(404).json({ msg: 'id is not equal to 36 chars' });
    }
    const found = categories.some(category => category.id === req.params.id);
    if (found) {
        const updPcategory = req.body;

        categories.forEach(category => {
            if (category.id === req.params.id) {
                category.name = updPcategory.name ? updPcategory.name : category.name;
                res.status(201).json({ msg: 'product updated' });
            }
        })
    }
    else {
        res.status(400).json({ msg: 'error in update item' })
    }

},
);


categRouter.delete('/:id', async (req, res, next) => {
    let IdCategory = req.params.id;
    if (IdCategory.length != 36) {
        res.status(404).json({ msg: 'id is not equal to 36 chars' });
    }
    const found = categories.some(category => category.id === req.params.id);
    if (found) {
        res.status(204)
        res.json({
            msg: 'Product deleted',
            products: categories.filter(category => category.id !== req.body.id)
        });
    } else {
        res.status(400).json({ msg: `no product with the id of ${req.body.id}` });
    }
});

export { categRouter };
export { productsRouter };