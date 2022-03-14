import { useTheme } from '@ui-kitten/components';
import { EvaStatus } from '@ui-kitten/components/devsupport';

export const useStatusColor = (status: EvaStatus = 'primary') =>
  useTheme()[`color-${status}-default`];

export const useTextColor = (status: EvaStatus = 'basic') =>
  useTheme()[`text-${status}-color`];

export const useBackgroundColor = (level = 1) =>
  useTheme()[`background-basic-color-${level}`];
