import { useState, useEffect } from 'react';
import type { BackendProduct, BackendCategory } from '../services/api'; // type-only import
import { productApi, categoryApi } from '../services/api'; // regular import

// Local types
export interface Category {
  id: string;
  name: string;
  description?: string;
  badge?: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  diamonds: number;
  price: number;
  bonus?: string;
  tag?: string;
}

const STORAGE_KEY = 'rtu_catalog_backup';

function useCatalog() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from backend on mount
  useEffect(() => {
    loadFromBackend();
  }, []);

  const loadFromBackend = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load from backend API
      const [productsRes, categoriesRes] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAll()
      ]);
      
      if (productsRes.success && productsRes.data) {
        const backendProducts = productsRes.data; // TypeScript auto inference
        const convertedProducts: Product[] = backendProducts
          .filter(p => p.isActive)
          .map(p => ({
            id: p.id,
            categoryId: p.categoryId,
            name: p.name,
            diamonds: p.diamonds,
            price: p.price,
            bonus: p.bonus,
            tag: p.tag
          }));
        setProducts(convertedProducts);
        
        // Save to localStorage as backup
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          categories,
          products: convertedProducts
        }));
      } else {
        throw new Error(productsRes.message || 'Failed to load products');
      }
      
      if (categoriesRes.success && categoriesRes.data) {
        const backendCategories = categoriesRes.data; // TypeScript auto inference
        const convertedCategories: Category[] = backendCategories
          .filter(c => c.isActive)
          .map(c => ({
            id: c.id,
            name: c.name,
            description: c.description,
            badge: c.badge
          }));
        setCategories(convertedCategories);
      } else {
        throw new Error(categoriesRes.message || 'Failed to load categories');
      }
      
    } catch (err) {
      console.error('Failed to load from backend:', err);
      setError('Backend connection failed. Using local data.');
      
      // Use localStorage data as fallback
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as { categories: Category[], products: Product[] };
          if (parsed.categories) setCategories(parsed.categories);
          if (parsed.products) setProducts(parsed.products);
        } catch (parseErr) {
          console.error('Failed to parse localStorage data:', parseErr);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const newCategory: Category = {
        id: crypto.randomUUID(),
        ...category
      };
      
      // Save to backend
      const response = await categoryApi.create({
        id: newCategory.id,
        name: newCategory.name,
        description: newCategory.description || '',
        badge: newCategory.badge || '',
        isActive: true
      });
      
      if (response.success) {
        setCategories(prev => [...prev, newCategory]);
        saveToStorage();
        return { success: true, data: newCategory };
      } else {
        throw new Error(response.message || 'Failed to create category');
      }
    } catch (err) {
      console.error('Failed to save category to backend:', err);
      // Fallback to local storage
      setCategories(prev => [...prev, category as Category]);
      saveToStorage();
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create category' 
      };
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const response = await categoryApi.update(id, updates);
      if (response.success) {
        setCategories(prev => prev.map(cat => 
          cat.id === id ? { ...cat, ...updates } : cat
        ));
        saveToStorage();
        return { success: true };
      }
      return { success: false, error: response.message };
    } catch (err) {
      console.error('Failed to update category:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update category' 
      };
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const response = await categoryApi.delete(id);
      if (response.success) {
        setCategories(prev => prev.filter(cat => cat.id !== id));
        // Also remove products from this category
        setProducts(prev => prev.filter(product => product.categoryId !== id));
        saveToStorage();
        return { success: true };
      }
      return { success: false, error: response.message };
    } catch (err) {
      console.error('Failed to delete category:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete category' 
      };
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const newProduct: Product = {
        id: crypto.randomUUID(),
        ...product
      };
      
      // Get category name for backend
      const category = categories.find(c => c.id === product.categoryId);
      
      // Save to backend - fix: type assertion or explicit typing
      const productData = {
        id: newProduct.id,
        categoryId: newProduct.categoryId,
        name: newProduct.name,
        diamonds: newProduct.diamonds,
        price: newProduct.price,
        bonus: newProduct.bonus || '',
        tag: newProduct.tag || '',
        categoryName: category?.name || 'Unknown',
        isActive: true
      };
      
      const response = await productApi.create(productData);
      
      if (response.success) {
        setProducts(prev => [...prev, newProduct]);
        saveToStorage();
        return { success: true, data: newProduct };
      } else {
        throw new Error(response.message || 'Failed to create product');
      }
    } catch (err) {
      console.error('Failed to save product to backend:', err);
      // Fallback to local storage
      setProducts(prev => [...prev, product as Product]);
      saveToStorage();
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create product' 
      };
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const response = await productApi.update(id, updates);
      if (response.success) {
        setProducts(prev => prev.map(product => 
          product.id === id ? { ...product, ...updates } : product
        ));
        saveToStorage();
        return { success: true };
      }
      return { success: false, error: response.message };
    } catch (err) {
      console.error('Failed to update product:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update product' 
      };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await productApi.delete(id);
      if (response.success) {
        setProducts(prev => prev.filter(product => product.id !== id));
        saveToStorage();
        return { success: true };
      }
      return { success: false, error: response.message };
    } catch (err) {
      console.error('Failed to delete product:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete product' 
      };
    }
  };

  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ categories, products }));
  };

  return { 
    categories, 
    products, 
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    refresh: loadFromBackend
  };
}

export default useCatalog;