import BackgroundJobs from '~/components/BackgroundJobs';
import ExampleFormWizard from '~/components/FormWizard';

const JobWizardPage = () => {
  const handleJobAction = (jobId, action) => {
    // Handle job action (e.g., send to server)
    console.log(`Job ${jobId} action: ${action}`);
  };

  return (
    <div>
      <h1>Background Jobs</h1>
      <BackgroundJobs onAction={handleJobAction} />

      <h1>Create New Product</h1>
      <ExampleFormWizard />
    </div>
  );
};

export default JobWizardPage;