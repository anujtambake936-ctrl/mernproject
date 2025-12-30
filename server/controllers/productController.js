const Product = require("../models/product")

const getAllProducts = async (req, res) => {
    try {
        const { category } = req.query
        let query = {}
        
        if (category && category !== 'All') {
            query.category = category
        }

        const products = await Product.find(query).sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            products
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id
        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            })
        }

        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const createProduct = async (req, res) => {
    try {
        const { title, description, price, category, thumbnail, images, stock, rating, brand } = req.body

        if (!title || !description || !price || !category || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "Title, description, price, category, and thumbnail are required."
            })
        }

        const product = new Product({
            title,
            description,
            price,
            category,
            thumbnail,
            images: images || [],
            stock: stock || 0,
            rating: rating || 0,
            brand: brand || ''
        })

        await product.save()

        res.status(201).json({
            success: true,
            message: "Product created successfully.",
            product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const updates = req.body

        const product = await Product.findByIdAndUpdate(
            productId,
            updates,
            { new: true, runValidators: true }
        )

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            })
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const product = await Product.findByIdAndDelete(productId)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            })
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category')
        res.status(200).json({
            success: true,
            categories
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const importProducts = async (req, res) => {
    try {
        // Fetch products from dummyjson API using https module
        const https = require('https')
        
        const fetchData = () => {
            return new Promise((resolve, reject) => {
                https.get('https://dummyjson.com/products?limit=100', (response) => {
                    let data = ''
                    
                    response.on('data', (chunk) => {
                        data += chunk
                    })
                    
                    response.on('end', () => {
                        try {
                            resolve(JSON.parse(data))
                        } catch (error) {
                            reject(error)
                        }
                    })
                }).on('error', (error) => {
                    reject(error)
                })
            })
        }
        
        const data = await fetchData()
        
        if (!data.products || data.products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No products found to import."
            })
        }

        let imported = 0
        let skipped = 0
        const errors = []

        // Import each product
        for (const apiProduct of data.products) {
            try {
                // Check if product already exists (by title to avoid duplicates)
                const existing = await Product.findOne({ title: apiProduct.title })
                
                if (existing) {
                    skipped++
                    continue
                }

                // Transform API product to database format
                const product = new Product({
                    title: apiProduct.title,
                    description: apiProduct.description,
                    price: apiProduct.price,
                    category: apiProduct.category,
                    thumbnail: apiProduct.thumbnail,
                    images: apiProduct.images || [],
                    stock: apiProduct.stock || 0,
                    rating: apiProduct.rating || 0,
                    brand: apiProduct.brand || ''
                })

                await product.save()
                imported++
            } catch (error) {
                errors.push({
                    title: apiProduct.title,
                    error: error.message
                })
            }
        }

        res.status(200).json({
            success: true,
            message: `Import completed. ${imported} products imported, ${skipped} skipped.`,
            imported,
            skipped,
            errors: errors.length > 0 ? errors : undefined
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    importProducts
}
