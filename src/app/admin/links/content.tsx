import Link from "next/link";

import PanelTop from "@/components/panels/panelTop";

const AdminLinksContent = () => {
	return (
		<>
			<PanelTop className="h-auto w-11/12" title="Admin Links">
				<div className="flex flex-col space-y-2">
					<Link className="text-l text-blue-400" href="http://10.4.5.227:9000/">
						Portainer - Docker Containers
					</Link>
					<Link className="text-l text-blue-400" href="http://10.4.5.227:3080/">
						Gitea - Local Git Server / Testing / CI / CD
					</Link>
					<Link
						className="text-l text-blue-400"
						href="http://http://10.4.5.227:8081/"
					>
						Testing Dashboard - &apos;Testing&apos; Branch on Gitea
					</Link>
				</div>
			</PanelTop>
		</>
	);
};

export default AdminLinksContent;
