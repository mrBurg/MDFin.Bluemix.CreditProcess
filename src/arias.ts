//Атрибуты виджетов

/*Эта секция содержит атрибуты, определенные для элементов пользовательского интерфейса, (GUI) веб-документов или интернет-приложений, взаимодействующих с пользователем. Эти атрибуты предназначены для поддержки ролей-виджетов:*/

export enum WidgetAria {
  ariaAutocomplete = 'aria-autocomplete', //показывает, применяется ли автозаполнение для текстового поля;
  ariaChecked = 'aria-checked', //показывает состояние «checked» у чекбоксов или радиокнопок;
  ariaDisabled = 'aria-disabled', //показывает состояние «disabled» у элементов упражнения;
  ariaExpanded = 'aria-expanded', //показывает, развернут или свернут текущий элемент;
  ariaHidden = 'aria-hidden', //показывает состояние «hidden» у текущего элемента;
  ariaMultiline = 'aria-multiline', //показывает возможность многострочного ввода у текстового элемента;
  ariaMultiselectable = 'aria-multiselectable', //показывает возможность множественного выбора у элементов управления у тега <select>;
  ariaOrientation = 'aria-orientation', //показывает положение элемента (горизонтальное или вертикальное);
  ariaReadonly = 'aria-readonly', //показывает состояние «readonly» у элементов управления;
  ariaRequired = 'aria-required', //аналог HTML5 атрибута required;
  ariaSelected = 'aria-selected', //показывает состояние «selected» у элементов управления;
  ariaSort = 'aria-sort', //показывает порядок сортировки у строк таблицы или элементов с ролью «grid».
}

//Атрибуты для Live Region

/*Live Region — это элементы страницы, обновляемые в результате внешнего события, обычно вне пользовательского фокуса. Канонический пример Live Region — информер биржевых сводок.

Задача этих атрибутов — отобразить, какие изменения содержимого могут произойти, когда элемент не в фокусе, и обеспечить вспомогательным технологиям информацию о способе обработки обновления этого содержимого.*/

export enum LiveRegionAria {
  ariaBusy = 'aria-busy', //указывает, обновляются ли элемент и его поддерево, в настоящее время.
  ariaLive = 'aria-live', //указывает, что элемент будет обновлен, и описывает типы обновлений браузеру.
}

//Атрибуты перетаскивания (Drag-and-Drop)

/*Тут все понятно — эти атрибуты обеспечивают эффект drag-and-drop:*/

export enum DragAndDropAria {
  ariaGrabbed = 'aria-grabbed', //указывает, может ли элемент быть захвачен перетаскиванием;
  ariaDropeffect = 'aria-dropeffect', //определяет функции, которые могут быть задействованы в процессе и при завершении перетаскивания.
}

//Атрибуты отношений

/*В этой секции — атрибуты, указывающие на отношения или ассоциации между элементами, которые не могут быть полностью определены структурой документа.*/

export enum RelationAria {
  ariaActivedescendant = 'aria-activedescendant', //указывает на элемент, чей контент является активным потомком составного виджета;
  ariaControls = 'aria-controls', //указывает элемент (элементы), чьим содержанием или поведением управляет текущий элемент;
  ariaDescribedb = 'aria-describedb', //указывает элемент (или элементы), описывающие объект;
  ariaOwns = 'aria-owns', //определяет положение в иерархии документов по схеме потомок/родитель;
  ariaPosinset = 'aria-posinset', //определяет позицию элементов наборе;
  ariaSetsize = 'aria-setsize', //определяет число пунктов в текущем наборе lis-titems или treeitems.

  /*По состоянию на сегодняшний день это почти все, ну а чтобы покончить с этой непростой темой, приведем как пример использования технологии реализацию дерева на html-разметке с применением WAI-ARIA (пример из спецификации):
  
  <h1 id="treelabel">WAI-ARIA Tree Example</h1>
  <ul role="tree" aria-labelledby="treelabel" aria-activedescendant="example_id" tabindex=”0”>
      <li role=”treeitem” aria-expanded=”true”>Animals <ul role=”group”>
              <li role=”treeitem”>Birds</li>
              <li role=”treeitem” aria-expanded=”false”>Cats <ul role=”group”>
                      <li role=”treeitem”>Siamese</li>
                      <li role=”treeitem”>Tabby</li>
                  </ul>
              </li>
              <li role=”treeitem” aria-expanded=”true”>Dogs <ul role=”group”>
                      <li role=”treeitem” aria-expanded=”true”>Small Breeds <ul role=”group”>
                              <li role=”treeitem”>Chihuahua</li>
                              <li role=”treeitem” id=”example_id”>Italian Greyhound</li>
                              <li role=”treeitem”>Japanese Chin</li>
                          </ul>
                      </li>
                      <li role=”treeitem” aria-expanded=”false”>Medium Breeds <ul role=”group”>
                              <li role=”treeitem”>Beagle</li>
                              <li role=”treeitem”>Cocker Spaniel</li>
                              <li role=”treeitem”>Pit Bull</li>
                          </ul>
                      </li>
                      <li role=”treeitem” aria-expanded=”false”>Large Breeds <ul role=”group”>
                              <li role=”treeitem”>Afghan</li>
                              <li role=”treeitem”>Great Dane</li>
                              <li role=”treeitem”>Mastiff</li>
                          </ul>
                      </li>
                  </ul>
              </li>
          </ul>
      </li>
      <li role=”treeitem” aria-expanded=”true”>Minerals <ul role=”group”>
              <li role=”treeitem”>Zinc</li>
              <li role=”treeitem” aria-expanded=”false”>Gold <ul role=”group”>
                      <li role=”treeitem”>Yellow Gold</li>
                      <li role=”treeitem”>White Gold</li>
                  </ul>
              </li>
              <li role="treeitem">Silver</li>
          </ul>
      </li>
      <li role="treeitem" aria-expanded="true">Vegetables <ul role="group">
              <li role="treeitem">Carrot</li>
              <li role="treeitem">Tomato</li>
              <li role="treeitem">Lettuce</li>
          </ul>
      </li>
  </ul>*/
}
