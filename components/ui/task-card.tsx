'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Pencil, Trash2 } from 'lucide-react';

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  assignedTo?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: 'pending' | 'in-progress' | 'completed') => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
};

export function TaskCard({
  id,
  title,
  description,
  status,
  priority,
  dueDate,
  assignedTo,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="transition-all duration-200 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[priority]}`}>
              {priority}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
              {status}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          {dueDate && (
            <span>Due: {dueDate.toLocaleDateString()}</span>
          )}
          {assignedTo && (
            <span>Assigned to: {assignedTo}</span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(id)}
              className="h-8 px-2"
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(id)}
              className="h-8 px-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          
          {onStatusChange && (
            <select
              value={status}
              onChange={(e) => onStatusChange(id, e.target.value as 'pending' | 'in-progress' | 'completed')}
              className="text-xs border rounded px-2 py-1"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          )}
        </div>
      </CardContent>
    </Card>
  );
}