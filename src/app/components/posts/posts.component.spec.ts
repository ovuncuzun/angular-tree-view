import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostsComponent } from './posts.component';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTreeHarness } from '@angular/material/tree/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, FormsModule, MatSelectModule, MatButtonModule, MatTreeModule, MatIconModule],
      declarations: [PostsComponent]
    });
    fixture = TestBed.createComponent(PostsComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly get correct node with text', async () => {
    const tree = await loader.getHarness(MatTreeHarness);

    const treeNode1 = await tree.getNodes({ text: /San Francisco/ });
    expect(treeNode1.length).toBe(4);
    const firstChildofNode1 = treeNode1[1];
    expect(await firstChildofNode1.getText()).toContain('Proper PDF conversion ensures that every element of your document remains just as you left it.');

    const treeNode2 = await tree.getNodes({ text: /Sydney/ });
    expect(treeNode2.length).toBe(2);
    const firstChildOfNode2 = treeNode2[1];
    expect(await firstChildOfNode2.getText()).toContain('An expectation of digital efficiency has become the norm in our daily lives');

    const treeNode3 = await tree.getNodes({ text: /Dublin/ });
    expect(treeNode3.length).toBe(3);
    const firstChildOfNode3 = treeNode3[1];
    expect(await firstChildOfNode3.getText()).toContain('A modern PDF annotator that can accommodate all of the cooks in a very busy kitchen is what your employees really need.');
  });

  it('should correctly group by author', async () => {
    component.getPostsDataGroupBy('author');
    fixture.detectChanges();
    const tree = await loader.getHarness(MatTreeHarness);

    const treeNode1 = await tree.getNodes({ text: /Happy User/ });
    expect(treeNode1.length).toBe(2);
    const firstChildofNode1 = treeNode1[0];
    expect(await firstChildofNode1.getText()).toContain('Proper PDF conversion ensures that every element of your document remains just as you left it.');

    const treeNode2 = await tree.getNodes({ text: /Happy Developer/ });
    expect(treeNode2.length).toBe(2);
    const firstChildofNode2 = treeNode2[0];
    expect(await firstChildofNode2.getText()).toContain('Digital transformation isn’t just a buzzword');

    const treeNode3 = await tree.getNodes({ text: /Happy Manager/ });
    expect(treeNode3.length).toBe(2);
    const firstChildofNode3 = treeNode3[0];
    expect(await firstChildofNode3.getText()).toContain('A modern PDF annotator that can accommodate all of the cooks in a very busy kitchen is what your employees really need.');
  });
});
