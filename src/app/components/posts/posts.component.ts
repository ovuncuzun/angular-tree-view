import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { PostsService } from 'src/app/services/posts.service';
import { Subscription, map } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { MatSelectChange } from '@angular/material/select';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


interface Post {
  id: number;
  location: string;
  time: string,
  author: string,
  text: string,
  week: number
}

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | undefined;
  subscription: Subscription | undefined;
  treeControl = new NestedTreeControl((node: any) => node.children);
  dataSource = new MatTreeNestedDataSource();
  modalData: Post;

  constructor(private postsService: PostsService, private modal: NgbModal) {
  }

  ngOnInit() {
    this.getPostsDataGroupBy('location');
  }

  getPostsDataGroupBy(groupBy) {
    this.subscription = this.postsService.getTimeTableData()
      .pipe(map((posts: Post[]) => posts.map((post: Post) => {
        let currentDate = new Date(+post.time * 1000);
        var weekNumber = moment(currentDate).isoWeek();
        post.time = moment(currentDate).format('DD/MM/YYYY, h:mm:ss a');
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

  postClicked(node: Post) {
    this.modalData = node;
    this.modal.open(this.modalContent, { size: 'lg' });
  }
}
