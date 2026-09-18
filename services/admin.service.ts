export const adminService = {
  async getUsers() {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('No access token');
    
    const response = await fetch('http://localhost:8000/api/v1/admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 403) throw new Error('Forbidden: Admin access required');
      throw new Error('Failed to fetch users');
    }
    
    return response.json();
  },

  async getBusinesses() {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('No access token');
    
    const response = await fetch('http://localhost:8000/api/v1/admin/businesses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 403) throw new Error('Forbidden: Admin access required');
      throw new Error('Failed to fetch businesses');
    }
    
    return response.json();
  }
};
