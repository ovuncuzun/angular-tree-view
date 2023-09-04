import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { PostsService } from 'src/app/services/posts.service';
import { Subscription, from, map } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { MatSelectChange } from '@angular/material/select';


interface FoodNode {
  name: string;
  children?: FoodNode[];
}

interface Posts {
  id: number;
  location: string;
  time: Date,
  author: string,
  text: string
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
      },
      {
        name: 'Orange',
        children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
      },
    ],
  },
];

const TREE_DATA2: any = [
  {
    name: '12345',
    children: [{ name: '777' }, { name: '8888' }],
  }
];

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent {
  subscription: Subscription | undefined;
  treeControl = new NestedTreeControl((node: any) => node.children);
  dataSource = new MatTreeNestedDataSource();

  constructor(private postsService: PostsService) {
  }

  ngOnInit() {
    this.getPostsDataGroupBy('author');
  }

  getPostsDataGroupBy(groupBy) {
    this.subscription = this.postsService.getTimeTableData()
      .pipe(map((posts: any) => posts.map(post => {
        let currentDate = new Date(+post.time * 1000);
        var weekNumber = moment(currentDate).isoWeek();
        post.week = weekNumber;
        return post;
      })))
      .subscribe(data => {
        this.dataSource.data = this.getDataGroupedBy(data, groupBy);
      })
  }

  getDataGroupedBy(data, groupBy) {
    return _.chain(data)
      .groupBy(groupBy)
      .map((value, groupBy) => ({ filteredBy: groupBy, children: value }))
      .value();
  }

  groupByChanged({ value }: MatSelectChange) {
    this.getPostsDataGroupBy(value);
  }

  hasChild = (_: number, node: any) =>
    node.children && node.children.length > 0;

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
