import { useMedia } from "react-use";

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

import {
    Drawer,
    DrawerContent,
} from "@/components/ui/drawer";

interface ResponsiveModalProps {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ResponsiveModal = ({

}: ResponsiveModalProps) => {}; 