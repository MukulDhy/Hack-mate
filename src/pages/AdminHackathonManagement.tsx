// src/pages/AdminHackathonManagement.tsx
import React, { useState, useEffect } from 'react';
import { hackathonService } from '@/service/hackathonService';
import {Hackathon} from "@/types/hackathon"
import HackathonForm from '@/components/admin/HackathonForm';
import HackathonList from '@/components/admin/HackathonList';
import { showError, showSuccess } from '@/components/ui/ToasterMsg';

const AdminHackathonManagement: React.FC = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState<Hackathon | null>(null);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      setLoading(true);
      const data = await hackathonService.getAll();
      setHackathons(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch hackathons');

    showError("Failed To Fetch the Hachtons","ERROR",5000);
    showError(error,"ERROR",10000);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingHackathon(null);
    setShowForm(true);
  };

  const handleEdit = (hackathon: Hackathon) => {
    setEditingHackathon(hackathon);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingHackathon(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingHackathon(null);
    fetchHackathons();
    showSuccess(editingHackathon ? 'Hackathon updated successfully' : 'Hackathon created successfully',"Success",10000);
    // showError(error,"ERROR",10000);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this hackathon?')) return;

    try {
      await hackathonService.delete(id, 'Deleted by admin');
      showSuccess('Hackathon deleted successfully',"Success",10000);
      fetchHackathons();
    } catch (err: any) {
    showError("Failed To Delete the Hachtons","ERROR",5000);
    showError(error,"ERROR",10000);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h1 className="h2">Hackathon Management</h1>
          <p className="text-muted">Create, update, and manage hackathons</p>
        </div>
        <div className="col-auto">
          <button 
            className="btn btn-primary"
            onClick={handleCreate}
          >
            <i className="fas fa-plus me-2"></i>Create New Hackathon
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <HackathonList 
        hackathons={hackathons}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <HackathonForm
          hackathon={editingHackathon}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default AdminHackathonManagement;