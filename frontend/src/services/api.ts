const API_BASE_URL = 'http://3.27.116.101/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface BackendProduct {
  _id: string;
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  diamonds: number;
  price: number;
  bonus?: string;
  tag?: string;
  isActive: boolean;
  createdAt: string;
}

export interface BackendCategory {
  _id: string;
  id: string;
  name: string;
  description?: string;
  badge?: string;
  isActive: boolean;
  createdAt: string;
}

export interface PaymentData {
  transactionId: string;
  amount: number;
  playerId: string;
  productId: string;
  productName?: string;
  diamonds?: number;
  price?: number;
}

// Products API
export const productApi = {
  getAll: async (): Promise<ApiResponse<BackendProduct[]>> => {
    const response = await fetch(`${API_BASE_URL}/products`);
    return response.json();
  },
  
  getById: async (id: string): Promise<ApiResponse<BackendProduct>> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return response.json();
  },
  
  getByCategory: async (categoryId: string): Promise<ApiResponse<BackendProduct[]>> => {
    const response = await fetch(`${API_BASE_URL}/products/category/${categoryId}`);
    return response.json();
  },
  
  create: async (productData: Omit<BackendProduct, '_id' | 'createdAt' | 'categoryName'>): Promise<ApiResponse<BackendProduct>> => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return response.json();
  },
  
  update: async (id: string, productData: Partial<BackendProduct>): Promise<ApiResponse<BackendProduct>> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return response.json();
  },
  
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};

// Categories API
export const categoryApi = {
  getAll: async (): Promise<ApiResponse<BackendCategory[]>> => {
    const response = await fetch(`${API_BASE_URL}/products/categories/all`);
    return response.json();
  },
  
  create: async (categoryData: Omit<BackendCategory, '_id' | 'createdAt'>): Promise<ApiResponse<BackendCategory>> => {
    const response = await fetch(`${API_BASE_URL}/products/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData)
    });
    return response.json();
  },
  
  update: async (id: string, categoryData: Partial<BackendCategory>): Promise<ApiResponse<BackendCategory>> => {
    const response = await fetch(`${API_BASE_URL}/products/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData)
    });
    return response.json();
  },
  
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/products/categories/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};

// Payments API
export const paymentApi = {
  verify: async (paymentData: PaymentData): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return response.json();
  },
  
  getStatus: async (transactionId: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/payments/status/${transactionId}`);
    return response.json();
  },
  
  getAll: async (limit: number = 50): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/payments?limit=${limit}`);
    return response.json();
  }
};

// Database seed (one-time use)
export const seedApi = {
  seedDatabase: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/products/seed`, {
      method: 'POST'
    });
    return response.json();
  }
};