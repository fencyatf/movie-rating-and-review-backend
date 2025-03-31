import { Category } from "../models/categoryModel.js";

// Create a new category
export const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;

        // Check if the category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const category = new Category({ name });
        await category.save();

        res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        next(error);
    }
};

// Get all categories
export const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

// Update a category
export const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        category.name = name || category.name;
        await category.save();

        res.json({ message: "Category updated successfully", category });
    } catch (error) {
        next(error);
    }
};

// Delete a category
export const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await category.deleteOne();
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        next(error);
    }
};
