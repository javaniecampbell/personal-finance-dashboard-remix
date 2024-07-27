import React, { useState } from 'react';
import { useFormState } from '~/hooks/useFormState';

type FAQ = {
  id: string;
  question: string;
  answer: string;
};

type SupportTicket = {
  id: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
};

export const FAQList: React.FC<{ faqs: FAQ[] }> = ({ faqs }) => {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq) => (
        <div key={faq.id} className="border border-gray-200 rounded-md">
          <button
            className="w-full text-left px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{faq.question}</span>
              <span>{openFAQ === faq.id ? '▲' : '▼'}</span>
            </div>
          </button>
          {openFAQ === faq.id && (
            <div className="px-4 py-2 bg-gray-50">
              <p>{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const SupportTicketForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const { values, handleChange, handleSubmit } = useFormState({
    subject: '',
    description: '',
    priority: 'medium',
  });

  return (
    <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={values.subject}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
        <select
          id="priority"
          name="priority"
          value={values.priority}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Submit Ticket
      </button>
    </form>
  );
};

export const SupportTicketList: React.FC<{ tickets: SupportTicket[] }> = ({ tickets }) => (
  <div className="space-y-4">
    {tickets.map((ticket) => (
      <div key={ticket.id} className="border border-gray-200 rounded-md p-4">
        <h3 className="text-lg font-medium">{ticket.subject}</h3>
        <p className="text-sm text-gray-500">Status: {ticket.status}</p>
        <p className="text-sm text-gray-500">Priority: {ticket.priority}</p>
        <p className="text-sm text-gray-500">Created: {new Date(ticket.createdAt).toLocaleString()}</p>
        <p className="mt-2">{ticket.description}</p>
      </div>
    ))}
  </div>
);
