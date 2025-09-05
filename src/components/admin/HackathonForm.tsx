// src/components/admin/HackathonForm.tsx
import React, { useState, useEffect } from 'react';
import { hackathonService} from '@/service/hackathonService';
import {Hackathon,HackathonFormData} from "@/types/hackathon";
interface HackathonFormProps {
  hackathon?: Hackathon | null;
  onClose: () => void;
  onSuccess: () => void;
}

const HackathonForm: React.FC<HackathonFormProps> = ({ hackathon, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<HackathonFormData>({
    title: '',
    description: '',
    registrationDeadline: null,
    startDate: null,
    endDate: null,
    problemStatements: [''],
    maxTeamSize: 3,
    mode: 'offline',
    registrationFee: 0,
    prizes: [{ position: '', amount: 0 }],
    tags: [],
    requirements: [''],
    rules: [''],
    venue: '',
    winnerAnnouncementDate: null,
    maxRegistrations: 100,
    bannerImage: '',
    evaluationCriteria: [{ criterion: '', weight: 0 }],
    submissionDeadline: null,
    submissionFormat: '',
    organizer: { name: '', contactEmail: '', contactNumber: '', organization: '' },
    faqs: [{ question: '', answer: '' }],
    socialLinks: { website: '', linkedin: '', twitter: '', discord: '' },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hackathon) {
      // Convert string dates to Date objects for the form
      const formattedHackathon: HackathonFormData = {
        ...hackathon,
        registrationDeadline: hackathon.registrationDeadline ? new Date(hackathon.registrationDeadline) : null,
        startDate: hackathon.startDate ? new Date(hackathon.startDate) : null,
        endDate: hackathon.endDate ? new Date(hackathon.endDate) : null,
        winnerAnnouncementDate: hackathon.winnerAnnouncementDate ? new Date(hackathon.winnerAnnouncementDate) : null,
        submissionDeadline: hackathon.submissionDeadline ? new Date(hackathon.submissionDeadline) : null,
      };
      setFormData(formattedHackathon);
    }
  }, [hackathon]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value ? new Date(value) : null }));
  };

  const handleNestedChange = (parent: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof HackathonFormData],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => {
      const newArray = [...prev[field as keyof HackathonFormData] as string[]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field as keyof HackathonFormData] as string[], '']
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => {
      const newArray = [...prev[field as keyof HackathonFormData] as string[]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const handlePrizeChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const newPrizes = [...prev.prizes];
      newPrizes[index] = { ...newPrizes[index], [field]: value };
      return { ...prev, prizes: newPrizes };
    });
  };

  const addPrize = () => {
    setFormData(prev => ({
      ...prev,
      prizes: [...prev.prizes, { position: '', amount: 0 }]
    }));
  };

  const removePrize = (index: number) => {
    setFormData(prev => {
      const newPrizes = [...prev.prizes];
      newPrizes.splice(index, 1);
      return { ...prev, prizes: newPrizes };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.registrationDeadline) newErrors.registrationDeadline = 'Registration deadline is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.problemStatements.length === 0 || formData.problemStatements[0] === '') {
      newErrors.problemStatements = 'At least one problem statement is required';
    }

    // Date validation
    if (formData.registrationDeadline && formData.startDate && 
        formData.registrationDeadline >= formData.startDate) {
      newErrors.registrationDeadline = 'Registration deadline must be before start date';
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.startDate = 'Start date must be before end date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Convert Date objects back to strings for API
      const apiData: Partial<Hackathon> = {
        ...formData,
        registrationDeadline: formData.registrationDeadline?.toISOString(),
        startDate: formData.startDate?.toISOString(),
        endDate: formData.endDate?.toISOString(),
        winnerAnnouncementDate: formData.winnerAnnouncementDate?.toISOString(),
        submissionDeadline: formData.submissionDeadline?.toISOString(),
      };

      if (hackathon?._id) {
        await hackathonService.update(hackathon._id, apiData);
      } else {
        await hackathonService.create(apiData);
      }
      
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save hackathon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={true} onHide={onClose} size="xl" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{hackathon ? 'Edit Hackathon' : 'Create New Hackathon'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {Object.keys(errors).length > 0 && (
            <Alert variant="danger">
              Please fix the errors below.
            </Alert>
          )}

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Mode</Form.Label>
                <Form.Select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="hybrid">Hybrid</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <Row className="mb-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Registration Deadline *</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="registrationDeadline"
                  value={formData.registrationDeadline?.toISOString().slice(0, 16)}
                  onChange={(e) => handleDateChange('registrationDeadline', e.target.value)}
                  isInvalid={!!errors.registrationDeadline}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.registrationDeadline}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Start Date *</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate?.toISOString().slice(0, 16)}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  isInvalid={!!errors.startDate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.startDate}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>End Date *</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate?.toISOString().slice(0, 16)}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  isInvalid={!!errors.endDate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.endDate}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Winner Announcement Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="winnerAnnouncementDate"
                  value={formData.winnerAnnouncementDate?.toISOString().slice(0, 16) || ''}
                  onChange={(e) => handleDateChange('winnerAnnouncementDate', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Problem Statements *</Form.Label>
            {formData.problemStatements.map((statement, index) => (
              <div key={index} className="d-flex mb-2">
                <Form.Control
                  type="text"
                  value={statement}
                  onChange={(e) => handleArrayChange('problemStatements', index, e.target.value)}
                  placeholder={`Problem statement ${index + 1}`}
                />
                {formData.problemStatements.length > 1 && (
                  <Button
                    variant="outline-danger"
                    className="ms-2"
                    onClick={() => removeArrayItem('problemStatements', index)}
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => addArrayItem('problemStatements')}
              className="mt-2"
            >
              <i className="fas fa-plus me-1"></i> Add Problem Statement
            </Button>
            {errors.problemStatements && (
              <div className="text-danger small">{errors.problemStatements}</div>
            )}
          </Form.Group>

          <Row className="mb-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Max Team Size</Form.Label>
                <Form.Control
                  type="number"
                  name="maxTeamSize"
                  value={formData.maxTeamSize}
                  onChange={handleChange}
                  min={1}
                  max={10}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Registration Fee ($)</Form.Label>
                <Form.Control
                  type="number"
                  name="registrationFee"
                  value={formData.registrationFee}
                  onChange={handleChange}
                  min={0}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Max Registrations</Form.Label>
                <Form.Control
                  type="number"
                  name="maxRegistrations"
                  value={formData.maxRegistrations}
                  onChange={handleChange}
                  min={1}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Venue</Form.Label>
                <Form.Control
                  type="text"
                  name="venue"
                  value={formData.venue || ''}
                  onChange={handleChange}
                  placeholder="Venue location"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Prizes</Form.Label>
            {formData.prizes.map((prize, index) => (
              <Row key={index} className="mb-2">
                <Col md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Position (e.g., 1st, 2nd)"
                    value={prize.position}
                    onChange={(e) => handlePrizeChange(index, 'position', e.target.value)}
                  />
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="number"
                    placeholder="Amount ($)"
                    value={prize.amount}
                    onChange={(e) => handlePrizeChange(index, 'amount', Number(e.target.value))}
                  />
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="text"
                    placeholder="Description"
                    value={prize.description || ''}
                    onChange={(e) => handlePrizeChange(index, 'description', e.target.value)}
                  />
                </Col>
                <Col md={1}>
                  <Button
                    variant="outline-danger"
                    onClick={() => removePrize(index)}
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </Col>
              </Row>
            ))}
            <Button
              variant="outline-primary"
              size="sm"
              onClick={addPrize}
              className="mt-2"
            >
              <i className="fas fa-plus me-1"></i> Add Prize
            </Button>
          </Form.Group>

          {/* Additional fields can be added similarly */}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : (hackathon ? 'Update' : 'Create')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default HackathonForm;