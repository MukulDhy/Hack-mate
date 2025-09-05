// src/components/admin/HackathonList.tsx
import React from 'react';
import {Hackathon} from "@/types/hackathon"

interface HackathonListProps {
  hackathons: Hackathon[];
  onEdit: (hackathon: Hackathon) => void;
  onDelete: (id: string) => void;
}

const HackathonList: React.FC<HackathonListProps> = ({ hackathons, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const statusClasses: Record<string, string> = {
      upcoming: 'bg-primary',
      registration_open: 'bg-success',
      registration_closed: 'bg-warning',
      ongoing: 'bg-info',
      winner_to_announced: 'bg-secondary',
      completed: 'bg-dark',
      cancelled: 'bg-danger',
    };

    return (
      <span className={`badge ${statusClasses[status] || 'bg-secondary'}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Title</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Participants</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hackathons.map((hackathon) => (
                <tr key={hackathon._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      {hackathon.bannerImage && (
                        <img 
                          src={hackathon.bannerImage} 
                          alt={hackathon.title}
                          className="rounded me-3"
                          style={{ width: '60px', height: '40px', objectFit: 'cover' }}
                        />
                      )}
                      <div>
                        <h6 className="mb-0">{hackathon.title}</h6>
                        <small className="text-muted">{hackathon.tags.join(', ')}</small>
                      </div>
                    </div>
                  </td>
                  <td>{formatDate(hackathon.startDate)}</td>
                  <td>{formatDate(hackathon.endDate)}</td>
                  <td>
                    <span className="text-capitalize">{hackathon.mode}</span>
                  </td>
                  <td>
                    {getStatusBadge(hackathon.status || 'upcoming')}
                    {!hackathon.isActive && (
                      <span className="badge bg-danger ms-1">INACTIVE</span>
                    )}
                  </td>
                  <td>
                    {hackathon.totalMembersJoined || 0} / {hackathon.maxRegistrations || '∞'}
                  </td>
                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit(hackathon)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(hackathon._id!)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {hackathons.length === 0 && (
            <div className="text-center py-4">
              <i className="fas fa-trophy fa-3x text-muted mb-3"></i>
              <p className="text-muted">No hackathons found. Create your first one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HackathonList;