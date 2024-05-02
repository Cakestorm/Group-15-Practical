(async () => {
const $ = Almagest;
// BEGIN MODULE

if (!window?.localStorage?.getItem) return;
if (window.localStorage.getItem("__init__")) return;

const install = document.createElement("a");
install.id = "install-pwa";
install.innerText = "Install";
install.href = "/static/install.html";
document.querySelector("header").append(install);

const style = document.createElement("style");
style.innerText = `
#install-pwa {
	display: inline-block;
	padding: 0.5rem 1rem;
	margin-right: 2rem;
	align-self: center;
	text-decoration: none;
	font-weight: bold;
	color: var(--alma-white);
	background-color: var(--alma-purple);
}

@media (prefers-color-scheme: dark) {
	#install-pwa {
		color: var(--alma-purple);
		background-color: var(--alma-green);
	}
}
`;
document.head.append(style);

// END MODULE
})();