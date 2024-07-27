import React, { useState } from 'react';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { json } from '@remix-run/node';
import { requireUserId } from '~/utils/auth.server';
import { getFAQs, submitSupportTicket } from '~/utils/support.server';
import { useNotification } from '~/components/ErrorNotification';
import { useFormState } from '~/hooks/useFormState';
import { HelpCircle, MessageSquare, Book, ChevronDown, ChevronUp, Search } from 'lucide-react';

export const loader = async ({ request }) => {
  const userId = await requireUserId(request);
  const faqs = await getFAQs();
  return json({ faqs });
};

export const action = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const ticketData = Object.fromEntries(formData);
  
  await submitSupportTicket(userId, ticketData);
  return json({ success: true });
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="flex justify-between items-center w-full py-4 px-6 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900">{question}</span>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-700">{answer}</p>
        </div>
      )}
    </div>
  );
};

const SupportTicketForm = ({ onSubmit }) => {
  const { values, handleChange, handleSubmit, errors } = useFormState(
    { subject: '', description: '', priority: 'medium' },
    {
      subject: { required: 'Subject is required' },
      description: { required: 'Description is required' },
    }
  );

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
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={values.description}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        ></textarea>
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
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
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit Ticket
        </button>
      </div>
    </form>
  );
};

export default function HelpSupportPage() {
  const { faqs } = useLoaderData();
  const fetcher = useFetcher();
  const { addNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');

  const handleTicketSubmit = (ticketData) => {
    fetcher.submit(ticketData, { method: 'post' });
    addNotification('Support ticket submitted successfully', 'success');
  };

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Help & Support</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Frequently Asked Questions</h2>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search FAQs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="border-t border-gray-200">
              {filteredFAQs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>

          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">User Guide</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Learn how to use our platform effectively.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <ul className="list-disc pl-5 space-y-2">
                <li><a href="#" className="text-indigo-600 hover:text-indigo-900">Getting Started</a></li>
                <li><a href="#" className="text-indigo-600 hover:text-indigo-900">Managing Your Budget</a></li>
                <li><a href="#" className="text-indigo-600 hover:text-indigo-900">Tracking Expenses</a></li>
                <li><a href="#" className="text-indigo-600 hover:text-indigo-900">Setting Financial Goals</a></li>
                <li><a href="#" className="text-indigo-600 hover:text-indigo-900">Understanding Reports</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Contact Support</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Submit a ticket for personalized assistance.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <SupportTicketForm onSubmit={handleTicketSubmit} />
            </div>
          </div>

          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Contact Information</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">support@financedashboard.com</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">+1 (555) 123-4567</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Hours</dt>
                  <dd className="mt-1 text-sm text-gray-900">Monday-Friday, 9AM-5PM EST</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
