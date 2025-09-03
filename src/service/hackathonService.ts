import { Hackathon, HackathonFilters } from '@/types/hackathon';

// Cache implementation
const HACKATHON_CACHE_KEY = 'hackathons_cache';
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

interface HackathonResponse {
  success: boolean;
  count: number;
  total: number;
  currentPage: number;
  totalPages: number;
  data: Hackathon[];
}

interface CacheData {
  timestamp: number;
  data: HackathonResponse;
  filters: HackathonFilters;
}

const getCachedHackathons = (filters: HackathonFilters): HackathonResponse | null => {
  if (typeof window === 'undefined') return null;
  
  const cached = localStorage.getItem(HACKATHON_CACHE_KEY);
  if (!cached) return null;
  
  const cacheData: CacheData = JSON.parse(cached);
  const isExpired = Date.now() - cacheData.timestamp > CACHE_DURATION;
  const isSameFilters = JSON.stringify(cacheData.filters) === JSON.stringify(filters);
  
  return !isExpired && isSameFilters ? cacheData.data : null;
};

const setCachedHackathons = (data: HackathonResponse, filters: HackathonFilters) => {
  if (typeof window === 'undefined') return;
  
  const cacheData: CacheData = {
    timestamp: Date.now(),
    data,
    filters
  };
  
  localStorage.setItem(HACKATHON_CACHE_KEY, JSON.stringify(cacheData));
};

export const hackathonService = {
  async getHackathons(filters: HackathonFilters): Promise<HackathonResponse> {
    // Check cache first
    const cached = getCachedHackathons(filters);
    if (cached) {
      return cached;
    }
    
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.mode) queryParams.append('mode', filters.mode);
    if (filters.tags && filters.tags.length > 0) queryParams.append('tags', filters.tags.join(','));
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
    
    const response = await fetch(`/api/hackathons?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch hackathons');
    }
    
    const data: HackathonResponse = await response.json();
    
    // Cache the response
    setCachedHackathons(data, filters);
    
    return data;
  },
  
  async getHackathonById(id: string): Promise<Hackathon> {
    const response = await fetch(`/api/hackathons/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch hackathon');
    }
    
    const data = await response.json();
    return data.data;
  }
};