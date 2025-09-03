/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Modifications copyright (c) 2025 Arthur / github.com/arisdla.
 * Changes: adaption for personal use.
 */

import type {ReactNode} from 'react';
import Translate, {translate} from '@docusaurus/Translate';

import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import ShowcaseSearchBar from '@site/src/pages/resources/_components/ShowcaseSearchBar';
import ShowcaseCards from './_components/ShowcaseCards';
import ShowcaseFilters from './_components/ShowcaseFilters';

const TITLE = translate({message: 'Resources'});

function ShowcaseHeader() {
  return (
    <section className="margin-top--lg margin-bottom--lg text--center">
      <Heading as="h1">{TITLE}</Heading>
    </section>
  );
}

export default function Showcase(): ReactNode {
  return (
    <Layout title={TITLE}>
      <main className="margin-vert--lg">
        <ShowcaseHeader />
        <ShowcaseFilters />
        <div
          style={{display: 'flex', marginLeft: 'auto'}}
          className="container">
          <ShowcaseSearchBar />
        </div>
        <ShowcaseCards />
      </main>
    </Layout>
  );
}
