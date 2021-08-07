import styled from "styled-components";
import Leftside from "./Leftside";
import Main from "./Main";
import Rightside from "./Rightside";
import { useAppDispatch, useAppSelect } from "../redux/configStore";
import { getUser } from "../redux/modules/user";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import {} from "../redux/modules/article";
const Home = () => {
  const history = useHistory();
  const user = useAppSelect(getUser);
  const dispatch = useAppDispatch();

  return (
    <Container>
      {user.name || history.push("/")}
      <Section>
        <h5>
          <a>고용이 필요하신가요? - </a>
        </h5>
        <p>재능있는 전문가를 찾고 회사를 키워보세요!</p>
      </Section>
      <Layout>
        <Leftside user={user} />
        <Main user={user} />
        <Rightside />
      </Layout>
    </Container>
  );
};

const Container = styled.div`
  padding-top: 52px;
  max-width: 100%;
`;

const Content = styled.div`
  max-width: 1128px;
  margin-left: auto;
  margin-right: auto;
`;

const Section = styled.section`
  min-height: 50px;
  padding: 16px 0;
  box-sizing: content-box;
  text-align: center;
  text-decoration: underline;
  display: flex;
  justify-content: center;
  h5 {
    color: #0a66c2;
    font-size: 14px;
    a {
      font-weight: 700;
    }
  }
  p {
    font-size: 14px;
    color: #434649;
    font-weight: 600;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0 5px;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-areas: "leftside main rightside";
  grid-template-columns: minmax(0, 5fr) minmax(0, 12fr) minmax(300px, 7fr);
  column-gap: 25px;
  row-gap: 25px;
  /* grid-template-row: auto; */
  margin: 25px 0;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding: 0 5px;
  }
`;

export default Home;
