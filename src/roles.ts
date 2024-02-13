//Абстрактные роли (Abstract Roles)

/*Используются, чтобы поддержать ролевую таксономию WAI-АРИИ с целью определения общих ролевых понятий. При разработке реальных документов их использовать не следует — они введены для онтологии (полноты описания). Примеры абстрактных ролей:*/

export enum AbstractRoles {
  roletype = 'roletype', // базовая роль, являющаяся родительской для остальных в этой таксономии;
  window = 'window', // окно браузера или приложения (roletype);
  widget = 'widget', // интерактивный компонент графического интерфейса пользователя (GUI). Родительский элемент для практически всех элементов управления (roletype);
  structure = 'structure', // общий тип для основных структурных элементов (roletype);
  command = 'command', // форма виджета, выполняющего действие, но не получающего входных данных (HTML5-аналог — тег <command>) (widget);
  composite = 'composite', // виджет, включающий в себя навигационные элементы и дочерний контент (widget);
  landmark = 'landmark', // область страницы, используемая как навигационный ориентир (region);
  section = 'section', // структурная единица в документе или приложении, объединяющая контент в секцию (structure);
  sectionhead = 'sectionhead', // структура, маркирующая связанную с ней секцию (structure);
  input = 'input', //нету такой роли "input"!!! // общий тип для виджета, представляющего поля ввода (widget);
  textbox = 'textbox', // поле для ввода текста. Эквиваленты в HTML — <textarea> или <input> с типами text, email, tel, url.;
  select = 'select', // общий тип для элемента; формы, позволяющие сделать выбор из списка (input);
  range = 'range', // общий тип для элемента; формы, позволяющие сделать выбор из диапазона значений(input).
  presentation = 'presentation', // Пометка элемента с помощью ролевого представления указывает, что этот элемент существует для поддержки веб-приложения и не предназначен для непосредственного взаимодействия людей.
}

//Роли — виджеты (Widget Roles)

/*Роли, выполняющие роль автономного пользовательского интерфейса, или автономной части, пользовательского интерфейса:*/

export enum WidgetRoles {
  alert = 'alert', // сообщения с критически важной информацией (region);
  button = 'button', // соответствует кнопке в широком смысле слова, то есть объекту с двумя положениями, который при нажатии запускает какие-то действия, определенные пользователем;
  checkbox = 'checkbox', // элемент управления с тремя возможными состояниями — true, false или mixed (input);
  radio = 'radio', // элемент, соответствующий радиокнопке — может быть выбран только один из группы (checkbox);
  radiogroup = 'radiogroup', // группа радиокнопок (select);
  dialog = 'dialog', // окно приложения, которое разработано, чтобы прервать текущую обработку применения, чтобы побудить пользователя входить в информацию или требовать ответа;
  grid = 'grid', // интерактивный контроль в виде таблицы;
  gridcell = 'gridcell', // ячейка таблицы или древовидной структуры;
  link = 'link', // интерактивная ссылка на внутренний или внешний ресурс;
  log = 'log', // регион, в котором новая информация добавляется в определенном порядке к старой (region);
  marquee = 'marquee', // область контента с изменяющейся информацией;
  menu = 'menu', // тип виджета, предлагающий пользователю список пунктов для выбора;
  menubar = 'menubar', // представление пунктов меню, обычно в виде горизонтальной полоски;
  menuitem = 'menuitem', // пункт меню;
  option = 'option', // элемент выбора из списка;
  listbox = 'listbox', // виджет, позволяющий пользователю выбирать один или несколько пунктов из списка выбора;
  progressbar = 'progressbar', // аналог HTML5-элемента <progress>;
  scrollbar = 'scrollbar', // графический объект, который управляет прокруткой содержания в области видимости (range);
  combobox = 'combobox', // виджет, позволяющий выбрать текстовый элемент из списка или ввести текст в поле ввода;
  textbox = 'textbox', // поле для ввода текста;
  slider = 'slider', // элемент для ввода данных пользователем, где пользователь выбирает значение в пределах данного диапазона (частный случай — <input type= ”range”>);
  Status = 'Status', // контейнер, содержание которого — информация для пользователя, недостаточно важно для элемента alert, чаще всего это статусная строка();
  tablist = 'tablist', // список tab-вкладок (accordion);
  tab = 'tab', // гримирующий элемент в виде tab-вкладки (widget);
  tabpanel = 'tabpanel', // панель, собирающая tab-элементы (region);
  timer = 'timer', // тип региона, содержащего числовой счетчик, указывающий количество времени, прошедшего от стартовой точки или оставшегося до конечной точки (status);
  tooltip = 'tooltip', // контекстное всплывающее окно, показывающее описание для элемента (section);
  tree = 'tree', // тип списка, содержащий древовидно (nested) организованные подуровни (select);
  treeitem = 'treeitem', // пункт выбора в древовидной структуре(listitem, option).
}

//Роли структуры документа (Document Structure Roles)

export enum DocumentStructureRoles {
  document = 'document', // регион, отмеченный как веб-документ;
  article = 'article', // секция страницы, имеющая самостоятельное автономное содержание (соответствует <article></article>);
  definition = 'definition', // секция c определением термина или понятия (section);
  directory = 'directory', // шисок ссылок на членов группы, таких как статическое оглавление (list);
  group = 'group', // секция, объединяющая элементы, не сгруппированные другими средствами;
  heading = 'heading', // соответствует контейнеру <header></header> в HTML5;
  img = 'img', // контейнер для коллекции элементов, формирующих изображение;
  list = 'list', // группа записей, объединенных в список;
  listitem = 'listitem', // единичный элемент списка или директории;
  math = 'math', // контейнер для представления математических выражений (section). Пример для формата MathML:
  /*<div role="math" aria-label="6 divided by 4 equals 1.5">
    <math xmlns="Http://www. w3.org/1998/Math/MathML">
      <mfrac>
        <mn>6</mn>
        <mn>4</mn>
      </mfrac>
      <mo>=</mo>
      <mn>1.5</mn>
    </math>
  </div>*/
  region = 'region', // область веб-страницы или документа, имеющая большое самостоятельное значение (section);
  row = 'row', // ряд ячеек таблицы (group);
  toolbar = 'toolbar', // коллекция обычно используемых кнопок функции представлена в компактной визуальной форме;
  note = 'note', // секция, содержание которой вводное или вспомогательное для основного содержания ресурса(section).
}

//Роли разметки (Landmark Roles)

/*Области страницы, предназначенной как навигационные ориентиры:*/
export enum LandmarkRoles {
  application = 'application', // — регион, отмеченный как веб-приложение (в отличие от веб-документа);
  banner = 'banner', // — область, занимающая определенное место, без привязки к содержанию (собственно буквальное значение этого термина);
  complementary = 'complementary', // — секция документа, служащая дополнением к основному содержанию;
  contentinfo = 'contentinfo', // — большой заметный регион, содержащий информацию о родительском документе;
  form = 'form', // — регион, содержащий коллекцию элементов вода;
  main = 'main', // — основная часть документа;
  navigation = 'navigation', // — регион, содержащий коллекцию элементов навигации, соответствует HTML5-контейнеру <nav></nav>;
  search = 'search', // — регион, содержащий коллекцию элементов ввода для поиска.Частный случай — <input type= "search" >.
}

//Не стандартные роли
export enum NonStandardRoles {
  textWithHTML = 'text-with-HTML',
}
