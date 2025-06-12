import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, CircularProgress, Fab, Backdrop } from '@mui/material'
import { Send } from '@mui/icons-material'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CreateIssueRequest } from '@/types/Issue'

interface FormData {
  title: string
  description: string
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  assignee: string
  application: string
}

interface FormErrors {
  title?: string
  description?: string
  priority?: string
  assignee?: string
  application?: string
}

export default function CreateIssue() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: 'Medium',
    assignee: '',
    application: '',
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)

  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    if (!formData.title.trim()) {
      errors.title = 'Title is required'
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required'
    }

    if (!formData.assignee.trim()) {
      errors.assignee = 'Assignee is required'
    }

    if (!formData.application.trim()) {
      errors.application = 'Application is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      setShowSubmitDialog(false)
      return
    }

    setSubmitting(true)
    try {
      const createRequest: CreateIssueRequest = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        assignee: formData.assignee.trim(),
        application: formData.application.trim(),
      }

      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createRequest),
      })

      if (response.ok) {
        const newIssue = await response.json()
        navigate(`/issues/${newIssue.id}`)
      } else {
        console.error('Failed to create issue')
      }
    } catch (error) {
      console.error('Error creating issue:', error)
    } finally {
      setSubmitting(false)
      setShowSubmitDialog(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Issue
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Report a new issue or problem that needs to be tracked and resolved.
        </Typography>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter a brief, descriptive title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={formErrors.title ? 'border-red-500' : ''}
            />
            {formErrors.title && (
              <Typography variant="caption" color="error">
                {formErrors.title}
              </Typography>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Provide a detailed description of the issue..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={6}
              className={formErrors.description ? 'border-red-500' : ''}
            />
            {formErrors.description && (
              <Typography variant="caption" color="error">
                {formErrors.description}
              </Typography>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'Low' | 'Medium' | 'High' | 'Critical') =>
                  handleInputChange('priority', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee *</Label>
              <Input
                id="assignee"
                placeholder="Who should handle this issue?"
                value={formData.assignee}
                onChange={(e) => handleInputChange('assignee', e.target.value)}
                className={formErrors.assignee ? 'border-red-500' : ''}
              />
              {formErrors.assignee && (
                <Typography variant="caption" color="error">
                  {formErrors.assignee}
                </Typography>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="application">Application *</Label>
            <Input
              id="application"
              placeholder="Which application or system is affected?"
              value={formData.application}
              onChange={(e) => handleInputChange('application', e.target.value)}
              className={formErrors.application ? 'border-red-500' : ''}
            />
            {formErrors.application && (
              <Typography variant="caption" color="error">
                {formErrors.application}
              </Typography>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/issues')}
            >
              Cancel
            </Button>
            <Button
              onClick={() => setShowSubmitDialog(true)}
              disabled={submitting}
            >
              Create Issue
            </Button>
          </div>
        </CardContent>
      </Card>

      <Fab
        color="primary"
        aria-label="submit issue"
        onClick={() => setShowSubmitDialog(true)}
        disabled={submitting}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <Send />
      </Fab>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showSubmitDialog}
        onClick={() => setShowSubmitDialog(false)}
      >
        <Card className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
          <CardHeader>
            <CardTitle>Create Issue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Typography variant="body2">
              Are you sure you want to create this issue? Please review all the details before submitting.
            </Typography>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowSubmitDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <CircularProgress size={16} className="mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Issue'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Backdrop>
    </div>
  )
}
