import React from 'react';
import {
  LifeBuoy,
  PlusCircle,
  HeartHandshake,
  CheckCircle,
  ShieldAlert,
  AlertTriangle,
  BookOpen,
  Server,
  Layers,
  Database
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '12px' }}>
          How SkillSOS Works
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
          A community-driven student assistance platform built for campus life, practicals, notes sharing, and peer collaboration.
        </p>
      </div>

      {/* Emergency Disclaimer Alert Box */}
      <div style={{
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px 28px',
        marginBottom: '40px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px'
      }}>
        <AlertTriangle size={28} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fca5a5', marginBottom: '6px' }}>
            Critical Notice: Ordinary Campus Peer Help Only
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            SkillSOS is strictly an academic, peer-support, and campus convenience tool (such as borrowing calculators, finding lecture notes, or getting help with Java programming).
            <strong> It is NOT a substitute for emergency services.</strong> If you or someone nearby is experiencing a medical crisis, fire, violence, or security threat, dial official campus emergency dispatch immediately (ext. 100) or emergency authorities (112).
          </p>
        </div>
      </div>

      {/* 4 Steps Section */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff', marginBottom: '24px', textAlign: 'center' }}>
          The Peer Assistance Lifecycle
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {/* Step 1 */}
          <div className="card" style={{ padding: '24px', position: 'relative' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <PlusCircle size={22} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Step 1: Status OPEN
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px', color: '#ffffff' }}>
              Publish Request
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Specify what you need, your campus classroom/lab location, deadline, and urgency priority.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card" style={{ padding: '24px', position: 'relative' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <HeartHandshake size={22} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', marginBottom: '4px' }}>
              Step 2: Status ACCEPTED
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px', color: '#ffffff' }}>
              Peer Volunteers
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              A fellow student browsing the board clicks "I'll Help" and registers their campus email atomically via Firestore transactions.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card" style={{ padding: '24px', position: 'relative' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <CheckCircle size={22} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', marginBottom: '4px' }}>
              Step 3: Status RESOLVED
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px', color: '#ffffff' }}>
              Resolve Request
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Once assistance is provided, the requester or registered helper verifies completion and marks the request as resolved.
            </p>
          </div>

          {/* Step 4 */}
          <div className="card" style={{ padding: '24px', position: 'relative' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <LifeBuoy size={22} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#f59e0b', textTransform: 'uppercase', marginBottom: '4px' }}>
              Step 4: Flexibility
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px', color: '#ffffff' }}>
              Reopen If Needed
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              If a resolved request still requires assistance, the original requester can reopen it, returning its status to OPEN.
            </p>
          </div>
        </div>
      </div>

      {/* Community Guidelines */}
      <div className="card" style={{ padding: '32px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', marginBottom: '16px' }}>
          Community Guidelines &amp; Rules
        </h2>
        <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.8 }}>
          <li><strong>Respect Borrowed Property:</strong> Return calculators, drafters, or textbooks promptly in the same condition.</li>
          <li><strong>Accurate Details:</strong> Provide exact room numbers, department blocks, and realistic deadlines.</li>
          <li><strong>Fair Volunteering:</strong> Only volunteer if you are genuinely available on campus to assist.</li>
          <li><strong>No Cheating:</strong> Peer tutoring is encouraged; do not ask peers to complete live exams or graded tests on your behalf.</li>
          <li><strong>Safety First:</strong> Meet in well-lit public campus spaces such as libraries, common halls, or department corridors.</li>
        </ul>
      </div>

      {/* Architecture Highlights for Viva */}
      <div className="card" style={{ padding: '32px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', marginBottom: '16px' }}>
          Technical Architecture Highlights (For Viva)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
            <Server size={22} color="var(--accent-primary)" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>Java Spring Boot 3 &amp; JDK 21</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Layered architecture with Controllers, Services, DTOs, Bean Validation, and Global Exception Handling.
            </div>
          </div>

          <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
            <Database size={22} color="#10b981" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>Firebase Cloud Firestore</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              NoSQL persistence via official Firebase Admin SDK using atomic transactions for volunteer count concurrency.
            </div>
          </div>

          <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
            <Layers size={22} color="#f59e0b" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>XML / DOM Lab Syllabus</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Demonstrates W3C DocumentBuilderFactory DOM XML parsing for the campus facility directory.
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center' }}>
        <Link to="/requests" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
          Go to Request Board
        </Link>
      </div>
    </div>
  );
}
