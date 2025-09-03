/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Modifications copyright (c) 2025 Arthur / github.com/arisdla.
 * Changes: adaption for personal use.
 */

/* eslint-disable global-require */

import { translate } from "@docusaurus/Translate";
import { sortBy } from "@site/src/utils/jsUtils";

// LIST OF AVAILABLE TAGS
// Available tags to assign to a showcase site
// Please choose all tags that you think might apply.
// We'll remove inappropriate tags, but it's less likely that we add tags.
export type TagType =
  // DO NOT USE THIS TAG: we choose sites to add to favorites
  | "favorite"
  | "opensource"
  | "cybersecurity"
  | "email"
  | "apps"
  | "mac"
  | "paid"
  | "organization";

// Add sites to this list
// prettier-ignore
const Resources: Resource[] = [
  {
    title: "Amphetamine",
    description: 'Prevent your Mac from going to sleep with a simple menu bar app.',
    website: 'https://apps.apple.com/us/app/amphetamine/id937984704',
    source: '',
    tags: ['apps', 'mac'],
  },
  {
    title: "CISO Executive Network",
    description: 'Peer networking group for Chief Information Security Officers and other security executives.',
    website: 'https://www.cisoexecnet.com/',
    source: '',
    tags: ['organization', 'cybersecurity'],
  },
  {
    title: "CSA - Cloud Security Alliance",
    description: 'Global organization dedicated to defining and raising awareness of best practices to help ensure a secure cloud computing environment.',
    website: 'https://cloudsecurityalliance.org/',
    source: '',
    tags: ['organization', 'cybersecurity'],
  },
  {
    title: "CSO Online",
    description: 'CSO Online provides news, analysis, and research on a wide range of security and risk management topics.',
    website: 'https://www.csoonline.com/',
    source: '',
    tags: ['cybersecurity'],
  },
  {
    title: "Dark Reading",
    description: 'Dark Reading is a comprehensive news site that covers the latest cybersecurity threats, vulnerabilities, and technology trends.',
    website: 'https://www.darkreading.com/',
    source: '',
    tags: ['cybersecurity'],
  },
  {
    title: "HiddenMe",
    description: 'Hide desktop icons on your Mac.',
    website: 'https://apps.apple.com/us/app/hiddenme/id467040476',
    source: '',
    tags: ['apps', 'mac', 'paid'],
  },
  {
    title: "IceMenuBar",
    description: 'A macOS menu bar app for weather and temperature display.',
    website: 'https://icemenubar.app',
    source: '',
    tags: ['apps', 'mac'],
  },
  {
    title: "KeyboardCleanTool",
    description: 'Lock your keyboard for easy cleaning.',
    website: 'https://www.heise.de/download/product/keyboardcleantool-1342222',
    source: '',
    tags: ['apps', 'mac'],
  },
  {
    title: "Krebs on Security",
    description: 'Krebs on Security is a blog that covers in-depth security news and investigations.',
    website: 'https://krebsonsecurity.com/',
    source: '',
    tags: ['cybersecurity'],
  },
  {
    title: "LaunchControl",
    description: 'Launchd GUI for Mac.',
    website: 'https://www.soma-zone.com/LaunchControl/',
    source: '',
    tags: ['apps', 'mac', 'paid'],
  },
  {
    title: "LuLu",
    description: 'Free, open-source firewall for macOS.',
    website: 'https://objective-see.org/products/lulu.html',
    source: '',
    tags: ['apps', 'mac'],
  },
  {
    title: "Mail Tester",
    description: 'Mail Tester is a tool to test the quality of your email messages.',
    website: 'https://www.mail-tester.com/',
    source: '',
    tags: ['email'],
  },
  {
    title: "Mountain Duck",
    description: 'Mount server and cloud storage as a disk in Finder.',
    website: 'https://mountainduck.io/',
    source: '',
    tags: ['apps', 'mac', 'paid'],
  },
  {
    title: "NCSA - National Cyber Security Alliance",
    description: 'Nonprofit organization promoting cybersecurity awareness and education for individuals and businesses.',
    website: 'https://staysafeonline.org/',
    source: '',
    tags: ['organization', 'cybersecurity'],
  },
  {
    title: "OnyX",
    description: 'Mac maintenance and optimization tool.',
    website: 'https://www.titanium-software.fr/en/onyx.html',
    source: '',
    tags: ['apps', 'mac'],
  },
  {
    title: "OWASP Top 10",
    description: 'The OWASP Top 10 is a list of the ten most critical web application security risks.',
    website: 'https://owasp.org/www-project-top-ten/',
    source: '',
    tags: ['cybersecurity'],
  },
  {
    title: "Sketch",
    description: 'Digital design toolkit for Mac.',
    website: 'https://www.sketch.com/',
    source: '',
    tags: ['apps', 'mac', 'paid'],
  },
  {
    title: "SSL Labs",
    description: 'SSL Labs provides a deep analysis of the SSL configuration of your public web server, helping you improve security and best practices.',
    website: 'https://www.ssllabs.com/',
    source: '',
    tags: ['cybersecurity'],
  },
  {
    title: "Tailscale",
    description: 'Zero-config VPN for secure networks.',
    website: 'https://tailscale.com/',
    source: '',
    tags: ['apps', 'mac'],
  },
  {
    title: "Tower",
    description: 'Powerful Git client for Mac.',
    website: 'https://www.git-tower.com/',
    source: '',
    tags: ['apps', 'mac', 'paid'],
  },
  {
    title: 'VirusTotal',
    description: 'Online file and URL scanning service',
    website: 'https://www.virustotal.com',
    source: '',
    tags: ['cybersecurity'],
  },
];


export type Resource = {
  title: string;
  description: string;
  website: string;
  source: string | null;
  tags: TagType[];
};

export type Tag = {
  label: string;
  description: string;
  color: string;
};

export const Tags: { [type in TagType]: Tag } = {
  favorite: {
    label: translate({ message: "Favorite" }),
    description: translate({
      message: "",
      id: "showcase.tag.favorite.description",
    }),
    color: "#e9669e",
  },

  opensource: {
    label: translate({ message: "Open-Source" }),
    description: translate({
      message: "Open-Source",
      id: "showcase.tag.opensource.description",
    }),
    color: "#39ca30",
  },

  cybersecurity: {
    label: translate({ message: "Cyber Security" }),
    description: translate({
      message: "Cyber Security",
      id: "showcase.tag.cybersecurity.description",
    }),
    color: "#14cfc3",
  },
  email: {
    label: translate({ message: "Email" }),
    description: translate({
      message: "Email testing, deliverability, and related tools.",
      id: "showcase.tag.email.description",
    }),
    color: "#f4b400",
  },
  apps: {
    label: translate({ message: "Apps" }),
    description: translate({
      message: "Applications, utilities, and software tools.",
      id: "showcase.tag.apps.description",
    }),
    color: "#4285f4",
  },
  mac: {
    label: translate({ message: "Mac" }),
    description: translate({
      message: "Mac-specific applications and resources.",
      id: "showcase.tag.mac.description",
    }),
    color: "#888888",
  },
  paid: {
    label: translate({ message: "Paid" }),
    description: translate({
      message: "Commercial or paid resource.",
      id: "showcase.tag.paid.description",
    }),
    color: "#eab308",
  },
    organization: {
      label: translate({ message: "Organization" }),
      description: translate({
        message: "Organization.",
        id: "showcase.tag.organization.description",
      }),
      color: "#7c3aed",
    },
};

export const TagList = Object.keys(Tags) as TagType[];
function sortResources() {
  let result = Resources;
  // Sort by site name
  result = sortBy(result, (resource) => resource.title.toLowerCase());
  // Sort by favorite tag, favorites first
  result = sortBy(result, (resource) => !resource.tags.includes("favorite"));
  return result;
}

export const sortedResources = sortResources();
