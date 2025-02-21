
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';

interface ProjectCardProps {
  id: number;
  name: string;
  description: string;
  endTime: number;
  totalDonations: string;
  isListed: boolean;
}

const ProjectCard = ({ id, name, description, endTime, totalDonations, isListed }: ProjectCardProps) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const formatEther = (wei: string) => {
    return parseFloat(ethers.utils.formatEther(wei)).toFixed(4);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{name}</CardTitle>
          <Badge variant={isListed ? "default" : "destructive"}>
            {isListed ? "Listed" : "Delisted"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-gray-600 line-clamp-2 mb-4">{description}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center text-gray-500">
            <Calendar size={16} className="mr-1" />
            <span>Ends: {formatDate(endTime)}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <DollarSign size={16} className="mr-1" />
            <span>{formatEther(totalDonations)} ETH</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/project/${id}`} className="w-full">
          <Button className="w-full bg-primary hover:bg-primary/90" variant="default">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
