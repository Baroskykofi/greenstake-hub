
import React, { useEffect, useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { CONTRACT_ADDRESSES, MINIMAL_ABI, getContract } from '@/lib/web3/contracts';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useReadContract } from 'wagmi';

interface Project {
  id: bigint;
  name: string;
  description: string;
  owner: string;
  subscriptionEndTime: bigint;
  isListed: boolean;
  totalDonations: bigint;
}

const Projects = () => {
  const { provider, account } = useWeb3();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Get project counter
  const { data: projectCounter } = useReadContract({
    address: CONTRACT_ADDRESSES.PROJECT_LISTING as `0x${string}`,
    abi: MINIMAL_ABI.ProjectListing,
    functionName: 'projectCounter',
  }) as { data: bigint };

  // Get projects
  const { data: projectsData } = useReadContract({
    address: CONTRACT_ADDRESSES.PROJECT_LISTING as `0x${string}`,
    abi: MINIMAL_ABI.ProjectListing,
    functionName: 'projects',
    args: [0n], // Start with first project
    query: {
      enabled: !!projectCounter,
    },
  }) as { data: Project };

  useEffect(() => {
    const fetchProjects = async () => {
      if (!provider || !account || !projectCounter) return;

      try {
        const contract = getContract(
          CONTRACT_ADDRESSES.PROJECT_LISTING,
          MINIMAL_ABI.ProjectListing,
          provider
        );

        const projectsArray = [];
        for (let i = 0; i < Number(projectCounter); i++) {
          const project = await contract.projects(i);
          projectsArray.push({
            id: project.id,
            name: project.name,
            description: project.description,
            owner: project.owner,
            subscriptionEndTime: project.subscriptionEndTime,
            isListed: project.isListed,
            totalDonations: project.totalDonations,
          });
        }
        setProjects(projectsArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, [provider, account, projectCounter]);

  if (!account) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to GreenStake</h1>
          <p className="text-xl text-gray-600 mb-8">Connect your wallet to start exploring projects</p>
          <div className="animate-bounce">
            <svg
              className="mx-auto h-10 w-10 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">Explore Projects</h1>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No projects found</p>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => window.location.href = '/list-project'}
            >
              Create the First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id.toString()}
                id={Number(project.id)}
                name={project.name}
                description={project.description}
                endTime={Number(project.subscriptionEndTime)}
                totalDonations={project.totalDonations.toString()}
                isListed={project.isListed}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
