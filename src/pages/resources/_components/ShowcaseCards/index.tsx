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
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import {sortedResources, type Resource} from '@site/src/data/resources';
import Heading from '@theme/Heading';
import FavoriteIcon from '../FavoriteIcon';
import ShowcaseCard from '../ShowcaseCard';
import {useFilteredUsers} from '../../_utils';

import styles from './styles.module.css';

const favoriteResources = sortedResources.filter((resource) =>
  resource.tags.includes('favorite'),
);

const otherResources = sortedResources.filter(
  (resource) => !resource.tags.includes('favorite'),
);

function HeadingNoResult() {
  return (
    <Heading as="h2">
      <Translate id="showcase.usersList.noResult">No result</Translate>
    </Heading>
  );
}

function HeadingFavorites() {
  return (
    <Heading as="h2" className={styles.headingFavorites}>
      <Translate id="showcase.favoritesList.title">Our favorites</Translate>
      <FavoriteIcon size="large" style={{marginLeft: '1rem'}} />
    </Heading>
  );
}

function HeadingAllSites() {
  return (
    <Heading as="h2">
      <Translate id="showcase.usersList.allUsers">All sites</Translate>
    </Heading>
  );
}

function CardList({heading, items}: {heading?: ReactNode; items: Resource[]}) {
  return (
    <div className="container">
      {heading}
      <ul className={clsx('clean-list', styles.cardList)}>
        {items.map((item) => (
          <ShowcaseCard key={item.title} resource={item} />
        ))}
      </ul>
    </div>
  );
}

function NoResultSection() {
  return (
    <section className="margin-top--lg margin-bottom--xl">
      <div className="container padding-vert--md text--center">
        <HeadingNoResult />
      </div>
    </section>
  );
}

export default function ShowcaseCards() {
  const filteredUsers = useFilteredUsers();

  if (filteredUsers.length === 0) {
    return <NoResultSection />;
  }

  return (
    <section className="margin-top--lg margin-bottom--xl">
      {filteredUsers.length === sortedResources.length ? (
        <>
          {/* <div className={styles.showcaseFavorite}>
            <CardList heading={<HeadingFavorites />} items={favoriteResources} />
          </div> */}
          <div className="margin-top--lg">
            <CardList heading={<HeadingAllSites />} items={otherResources} />
          </div>
        </>
      ) : (
        <CardList items={filteredUsers} />
      )}
    </section>
  );
}
