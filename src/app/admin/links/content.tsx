import Link from "next/link";

import PanelTop from "@/components/panels/panelTop";

const AdminLinksContent = () => {
	return (
		<>
			<PanelTop className="h-auto w-11/12" title="Admin Links">
				<div className="flex flex-col space-y-2">
					<Link
						className="text-l text-blue-400"
						href="http://10.4.5.227:9000/"
						rel="noopener noreferrer"
						target="_blank"
					>
						Portainer - Docker Containers
					</Link>
					<Link
						className="text-l text-blue-400"
						href="http://10.4.5.227:3080/"
						rel="noopener noreferrer"
						target="_blank"
					>
						Gitea - Local Git Server / Testing / CI / CD
					</Link>
					<Link
						className="text-l text-blue-400"
						href="http://10.4.5.227:8081/"
						rel="noopener noreferrer"
						target="_blank"
					>
						Testing Dashboard - &apos;Testing&apos; Branch on Gitea
					</Link>
				</div>
			</PanelTop>
		</>
	);
};

export default AdminLinksContent;
