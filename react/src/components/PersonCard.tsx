import React from 'react';
import { Person } from '@/types/memory';
import { RELATIONSHIP_LABELS } from '@/types/memory';

interface PersonCardProps {
  person?: Person;
  onEdit?: (personId: string) => void;
}

const PersonCard: React.FC<PersonCardProps> = ({
  person = {
    id: '1',
    name: '示例角色',
    relationship: 'myself',
    photos: [],
    voices: []
  },
  onEdit = () => console.log('Edit person:', person?.name)
}) => {
  const relationshipLabel = RELATIONSHIP_LABELS[person.relationship];
  
  return (
    <div data-cmp="PersonCard" className="bg-card rounded-xl p-4 shadow-custom border border-border">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
          <span className="text-lg">{relationshipLabel.charAt(0)}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{person.name}</h3>
          <p className="text-sm text-muted-foreground">{relationshipLabel}</p>
        </div>
        <button
          onClick={() => onEdit(person.id)}
          className="text-primary text-sm font-medium hover:underline"
        >
          编辑
        </button>
      </div>
    </div>
  );
};

export default PersonCard;