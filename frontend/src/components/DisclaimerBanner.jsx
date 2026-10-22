import React from 'react';
import { AlertTriangle, PhoneCall } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="disclaimer-banner">
      <AlertTriangle size={15} style={{ flexShrink: 0 }} />
      <span>
        <strong>PEER SUPPORT NOTICE:</strong> SkillSOS is strictly for routine student-to-student peer assistance (notes, calculator borrowing, study help). For medical, fire, or campus security emergencies, contact Campus Security immediately at <strong>ext. 100 / +91-000-000-112</strong>.
      </span>
    </div>
  );
}
